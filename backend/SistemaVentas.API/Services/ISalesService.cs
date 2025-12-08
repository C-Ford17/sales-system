using SistemaVentas.API.Models.Domain;
using SistemaVentas.API.Models.DTOs.Sales;

namespace SistemaVentas.API.Services
{
    public interface ISaleService
    {
        Task<Sale> CreateSaleAsync(CreateSaleRequest request, Guid userId);
        Task<List<SaleDto>> GetSalesAsync(string? filterNumber, DateTime? startDate, DateTime? endDate, Guid? userId = null);
        Task<SaleDto> GetSaleByIdAsync(Guid id);
    }
}
