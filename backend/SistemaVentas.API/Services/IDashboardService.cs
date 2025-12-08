using SistemaVentas.API.Models.DTOs.Dashboard;

namespace SistemaVentas.API.Services
{
    public interface IDashboardService
    {
        Task<DashboardStatsDto> GetStatsAsync(int days = 7);
    }
}
