using SistemaVentas.API.Models.Domain;
using SistemaVentas.API.Models.DTOs.Users;

namespace SistemaVentas.API.Services
{
    public interface IUserService
    {
        Task<List<UserDto>> GetAllUsersAsync();
        Task<User> CreateUserAsync(CreateUserDto dto);
        Task<User> UpdateUserAsync(Guid id, UpdateUserDto dto);
        Task DeleteUserAsync(Guid id);
    }
}
