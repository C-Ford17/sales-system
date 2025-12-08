using SistemaVentas.API.Models.Domain;
using SistemaVentas.API.Models.DTOs.Sales;

namespace SistemaVentas.API.Services
{
    public interface ISaleService
    {
        Task<Sale> CreateSaleAsync(CreateSaleRequest request, Guid userId);
    }
}
