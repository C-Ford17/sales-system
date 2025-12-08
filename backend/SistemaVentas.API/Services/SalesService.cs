using Microsoft.EntityFrameworkCore;
using SistemaVentas.API.Data;
using SistemaVentas.API.Models.Domain;
using SistemaVentas.API.Models.DTOs.Sales;

namespace SistemaVentas.API.Services
{
    public class SaleService : ISaleService
    {
        private readonly ApplicationDbContext _context;

        public SaleService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Sale> CreateSaleAsync(CreateSaleRequest request, Guid userId)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                // 1. Manejo del Método de Pago
                // Buscamos si existe el método de pago por nombre (ej. "Cash"), si no, usamos un ID por defecto o creamos uno simple
                // Para simplificar ahora, asumiremos que PaymentMethodId viene o lo buscamos
                var paymentMethodName = request.PaymentMethod.Trim(); // Limpiar espacios
                var paymentMethod = await _context.PaymentMethods
                    .FirstOrDefaultAsync(p => p.Name.ToLower() == paymentMethodName.ToLower());

                if (paymentMethod == null)
                {
                    // Lanzar excepción controlada
                    throw new Exception($"El método de pago '{request.PaymentMethod}' no existe en la base de datos. Métodos disponibles: Efectivo, Tarjeta, Transferencia.");
                }

                var sale = new Sale
                {
                    SaleNumber = GenerateSaleNumber(),
                    CreatedAt = DateTime.UtcNow, // Usar CreatedAt en lugar de Date
                    Status = "completed",
                    UserId = userId,
                    PaymentMethodId = paymentMethod.Id, // Usar relación
                    Notes = request.CustomerName ?? "", // Si no hay cliente, string vacío para evitar null
                    Details = new List<SaleDetail>() // Usar 'Details' en lugar de 'SaleDetails'
                };

                decimal totalAmount = 0;

                foreach (var item in request.Details)
                {
                    var product = await _context.Products.FindAsync(item.ProductId);
                    if (product == null) throw new Exception($"Producto {item.ProductId} no encontrado");
                    
                    if (product.QuantityInStock < item.Quantity)
                        throw new Exception($"Stock insuficiente para {product.Name}. Disponible: {product.QuantityInStock}");

                    // Restar Stock
                    product.QuantityInStock -= item.Quantity;
                    
                    var detail = new SaleDetail
                    {
                        ProductId = item.ProductId,
                        Quantity = item.Quantity,
                        UnitPrice = product.Price,
                        Subtotal = product.Price * item.Quantity, // 'Subtotal' (minúscula) según tu modelo
                        CreatedAt = DateTime.UtcNow
                    };

                    totalAmount += detail.Subtotal;
                    sale.Details.Add(detail); // Agregar a la colección 'Details'
                }

                sale.TotalAmount = totalAmount;

                _context.Sales.Add(sale);
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return sale;
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }
        public async Task<List<SaleDto>> GetSalesAsync(string? filterNumber, DateTime? startDate, DateTime? endDate, Guid? userId = null)
        {
            var query = _context.Sales
                .Include(s => s.User)
                .Include(s => s.PaymentMethod)
                .AsQueryable();

            if (!string.IsNullOrEmpty(filterNumber))
                query = query.Where(s => s.SaleNumber.Contains(filterNumber));

            if (startDate.HasValue)
                query = query.Where(s => s.CreatedAt >= startDate.Value.ToUniversalTime());

            if (endDate.HasValue)
                query = query.Where(s => s.CreatedAt <= endDate.Value.ToUniversalTime().AddDays(1)); // Incluir todo el día final

            if (userId.HasValue)
                query = query.Where(s => s.UserId == userId.Value);

            var sales = await query.OrderByDescending(s => s.CreatedAt).ToListAsync();

            return sales.Select(s => new SaleDto
            {
                Id = s.Id,
                SaleNumber = s.SaleNumber,
                UserName = s.User?.FullName ?? "Desconocido",
                TotalAmount = s.TotalAmount,
                PaymentMethodName = s.PaymentMethod?.Name ?? "N/A",
                Status = s.Status,
                CreatedAt = s.CreatedAt
            }).ToList();
        }

        public async Task<SaleDto> GetSaleByIdAsync(Guid id)
        {
            var sale = await _context.Sales
                .Include(s => s.User)
                .Include(s => s.PaymentMethod)
                .Include(s => s.Details)
                    .ThenInclude(d => d.Product)
                .FirstOrDefaultAsync(s => s.Id == id);

            if (sale == null) throw new Exception("Venta no encontrada");

            return new SaleDto
            {
                Id = sale.Id,
                SaleNumber = sale.SaleNumber,
                UserName = sale.User?.FullName,
                TotalAmount = sale.TotalAmount,
                PaymentMethodName = sale.PaymentMethod?.Name,
                Status = sale.Status,
                CreatedAt = sale.CreatedAt,
                Notes = sale.Notes,
                Details = sale.Details.Select(d => new SaleDetailDto
                {
                    ProductName = d.Product?.Name ?? "Producto eliminado",
                    Quantity = d.Quantity,
                    UnitPrice = d.UnitPrice,
                    Subtotal = d.Subtotal
                }).ToList()
            };
        }

        private string GenerateSaleNumber()
        {
            return $"VEN-{DateTime.Now:yyyyMMdd}-{new Random().Next(1000, 9999)}";
        }
    }
}
