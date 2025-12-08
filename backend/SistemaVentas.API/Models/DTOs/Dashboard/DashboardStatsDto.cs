namespace SistemaVentas.API.Models.DTOs.Dashboard
{
    public class DashboardStatsDto
    {
        public decimal WeeklyIncome { get; set; }
        public double IncomeChangePercentage { get; set; }
        public int WeeklySalesCount { get; set; }
        public double SalesChangePercentage { get; set; }
        public int ActiveProducts { get; set; }
        public int ActiveUsers { get; set; }
        
        // Para el gráfico de líneas (últimos 7 días)
        public List<decimal> DailySales { get; set; } = new();
        public List<string> DaysLabels { get; set; } = new();

        // Para el gráfico de dona (categorías)
        public List<CategoryStatDto> SalesByCategory { get; set; } = new();
    }

    public class CategoryStatDto 
    {
        public string CategoryName { get; set; }
        public int SalesCount { get; set; }
    }
}
