using Microsoft.EntityFrameworkCore;
using SistemaVentas.API.Data;
using SistemaVentas.API.Models.DTOs.Dashboard;

namespace SistemaVentas.API.Services
{
    public class DashboardService : IDashboardService
    {
        private readonly ApplicationDbContext _context;

        public DashboardService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<DashboardStatsDto> GetStatsAsync(int days = 7)
        {
            var today = DateTime.UtcNow.Date;
            var currentStart = today.AddDays(-days); // Inicio periodo actual
            var previousStart = currentStart.AddDays(-days); // Inicio periodo anterior
            var previousEnd = currentStart; // Fin periodo anterior

            // --- 1. INGRESOS ---
            // Periodo Actual
            var currentIncome = await _context.Sales
                .Where(s => s.CreatedAt >= currentStart)
                .SumAsync(s => s.TotalAmount);

            // Periodo Anterior
            var previousIncome = await _context.Sales
                .Where(s => s.CreatedAt >= previousStart && s.CreatedAt < previousEnd)
                .SumAsync(s => s.TotalAmount);

            // Cálculo %
            double incomeChange = 0;
            if (previousIncome > 0)
                incomeChange = (double)((currentIncome - previousIncome) / previousIncome) * 100;
            else if (currentIncome > 0)
                incomeChange = 100; // Crecimiento total si antes era 0

            // --- 2. CANTIDAD VENTAS ---
            var currentSalesCount = await _context.Sales.CountAsync(s => s.CreatedAt >= currentStart);
            var previousSalesCount = await _context.Sales.CountAsync(s => s.CreatedAt >= previousStart && s.CreatedAt < previousEnd);

            double salesChange = 0;
            if (previousSalesCount > 0)
                salesChange = (double)(currentSalesCount - previousSalesCount) / previousSalesCount * 100;
            else if (currentSalesCount > 0)
                salesChange = 100;

            // --- 3. OTROS DATOS ---
            var activeProducts = await _context.Products.CountAsync(p => p.Status == "active");
            var activeUsers = await _context.Users.CountAsync(u => u.Status == "active");

            // --- 4. GRÁFICO DIARIO (Dinámico según 'days') ---
            var dailySales = new List<decimal>();
            var daysLabels = new List<string>();

            // Si son muchos días (30), agrupamos diferente o mostramos menos puntos
            // Para simplificar, mostramos los últimos 7 o 'days' puntos
            int chartDays = days > 30 ? 30 : days; // Límite visual para el gráfico

            for (int i = chartDays - 1; i >= 0; i--)
            {
                var day = today.AddDays(-i);
                var nextDay = day.AddDays(1);
                
                var total = await _context.Sales
                    .Where(s => s.CreatedAt >= day && s.CreatedAt < nextDay)
                    .SumAsync(s => s.TotalAmount);

                dailySales.Add(total);
                daysLabels.Add(day.ToString("dd/MM"));
            }

            // --- 5. CATEGORÍAS (Igual que antes) ---
            var salesByCategory = await _context.SaleDetails
                .Include(sd => sd.Product).ThenInclude(p => p.Category)
                .Where(sd => sd.Sale.CreatedAt >= currentStart) // Filtrar por periodo también
                .GroupBy(sd => sd.Product.Category.Name)
                .Select(g => new CategoryStatDto { CategoryName = g.Key, SalesCount = g.Sum(x => x.Quantity) })
                .OrderByDescending(x => x.SalesCount)
                .Take(5)
                .ToListAsync();

            return new DashboardStatsDto
            {
                WeeklyIncome = currentIncome,
                IncomeChangePercentage = Math.Round(incomeChange, 1),
                WeeklySalesCount = currentSalesCount,
                SalesChangePercentage = Math.Round(salesChange, 1),
                ActiveProducts = activeProducts,
                ActiveUsers = activeUsers,
                DailySales = dailySales,
                DaysLabels = daysLabels,
                SalesByCategory = salesByCategory
            };
        }

    }
}
