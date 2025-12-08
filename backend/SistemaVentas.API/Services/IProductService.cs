using SistemaVentas.API.Models.Domain;
using SistemaVentas.API.Models.DTOs.Products;

namespace SistemaVentas.API.Services
{
    public interface IProductService
    {
        // El servicio devuelve DTOs directamente para desacoplar el controlador del dominio
        Task<List<ProductDto>> GetAllAsync(string? filterQuery = null, string? status = null);
        Task<ProductDto?> GetByIdAsync(Guid id);
        Task<ProductDto> CreateAsync(CreateProductRequest request, Guid userId);
        Task<ProductDto?> UpdateAsync(Guid id, UpdateProductRequest request);
        Task<bool> DeleteAsync(Guid id);
    }
}
