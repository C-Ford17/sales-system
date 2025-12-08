using Microsoft.EntityFrameworkCore;
using SistemaVentas.API.Data;
using SistemaVentas.API.Models.Domain;
using SistemaVentas.API.Models.DTOs.Products;

namespace SistemaVentas.API.Services
{
    public class ProductService : IProductService
    {
        private readonly ApplicationDbContext _context;
        private readonly CloudinaryService _cloudinaryService;
        public ProductService(ApplicationDbContext context, CloudinaryService cloudinaryService)
        {
            _context = context;
            _cloudinaryService = cloudinaryService;
        }

        public async Task<List<ProductDto>> GetAllAsync(string? filterQuery = null, string? status = null)
        {
            var query = _context.Products.Include(p => p.Category).AsQueryable();

            if (!string.IsNullOrWhiteSpace(filterQuery))
            {
                // Convertimos el término de búsqueda a minúsculas
                var term = filterQuery.ToLower();
                // Buscamos convirtiendo también el campo de la BD a minúsculas
                query = query.Where(x => x.Name.ToLower().Contains(term) || 
                                         x.SKU.ToLower().Contains(term));
            }

            if (!string.IsNullOrWhiteSpace(status) && status != "Todos")
            {
                query = query.Where(x => x.Status == status);
            }

            var products = await query.OrderByDescending(x => x.CreatedAt).ToListAsync();

            // Mapeo a DTO
            return products.Select(MapToDto).ToList();
        }

        public async Task<ProductDto?> GetByIdAsync(Guid id)
        {
            var product = await _context.Products.Include(p => p.Category).FirstOrDefaultAsync(x => x.Id == id);
            return product == null ? null : MapToDto(product);
        }

        public async Task<ProductDto> CreateAsync(CreateProductRequest request, Guid userId)
        {
            // Validar SKU único
            if (await _context.Products.AnyAsync(x => x.SKU == request.SKU))
            {
                throw new InvalidOperationException("El SKU ya existe.");
            }

            var product = new Product
            {
                Name = request.Name,
                Description = request.Description,
                Price = request.Price,
                Cost = request.Cost,
                QuantityInStock = request.QuantityInStock,
                MinStock = request.MinStock,
                CategoryId = request.CategoryId,
                SKU = request.SKU,
                Status = "active",
                CreatedBy = userId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            if (request.Image != null)
            {
                product.ImageUrl = await _cloudinaryService.UploadImageAsync(request.Image);
            }

            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            // Recargar para traer la categoría (si es necesario para el DTO de respuesta)
            // O simplemente devolver con CategoryName null por ahora
            return MapToDto(product);
        }

        public async Task<ProductDto?> UpdateAsync(Guid id, UpdateProductRequest request)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null) return null;

            product.Name = request.Name;
            product.Description = request.Description;
            product.Price = request.Price;
            product.Cost = request.Cost;
            product.QuantityInStock = request.QuantityInStock;
            product.MinStock = request.MinStock;
            product.CategoryId = request.CategoryId;
            product.SKU = request.SKU;
            product.Status = request.Status;
            product.UpdatedAt = DateTime.UtcNow;
            if (request.Image != null)
            {
                product.ImageUrl = await _cloudinaryService.UploadImageAsync(request.Image);
            }
            await _context.SaveChangesAsync();
            return MapToDto(product);
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null) return false;

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();
            return true;
        }

        // Método auxiliar de mapeo
        private static ProductDto MapToDto(Product p)
        {
            return new ProductDto
            {
                Id = p.Id,
                Name = p.Name,
                Description = p.Description,
                Price = p.Price,
                Cost = p.Cost,
                QuantityInStock = p.QuantityInStock,
                MinStock = p.MinStock,
                CategoryId = p.CategoryId,
                CategoryName = p.Category?.Name ?? "N/A",
                SKU = p.SKU,
                Status = p.Status,
                ImageUrl = p.ImageUrl,
                CreatedAt = p.CreatedAt
            };
        }
    }
}
