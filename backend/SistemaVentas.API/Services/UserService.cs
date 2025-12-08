using Microsoft.EntityFrameworkCore;
using SistemaVentas.API.Data;
using SistemaVentas.API.Models.Domain;
using SistemaVentas.API.Models.DTOs.Users;
using BCrypt.Net;

namespace SistemaVentas.API.Services
{
    public class UserService : IUserService
    {
        private readonly ApplicationDbContext _context;

        public UserService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<UserDto>> GetAllUsersAsync()
        {
            return await _context.Users
                .Include(u => u.Role)
                .Select(u => new UserDto
                {
                    Id = u.Id,
                    FullName = u.FullName,
                    Email = u.Email,
                    RoleName = u.Role.Name,
                    RoleId = u.RoleId,
                    Status = u.Status
                })
                .ToListAsync();
        }

        public async Task<User> CreateUserAsync(CreateUserDto dto)
        {
            // Validar email duplicado
            if (await _context.Users.AnyAsync(u => u.Email == dto.Email))
                throw new Exception("El email ya está registrado.");

            var user = new User
            {
                FullName = dto.FullName,
                Email = dto.Email,
                RoleId = dto.RoleId,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                Status = "active",
                Phone = "",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return user;
        }

        public async Task<User> UpdateUserAsync(Guid id, UpdateUserDto dto)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) throw new Exception("Usuario no encontrado");

            user.FullName = dto.FullName ?? user.FullName;
            user.Email = dto.Email ?? user.Email;
            user.Status = dto.Status ?? user.Status;
            
            if (dto.RoleId.HasValue) user.RoleId = dto.RoleId.Value;

            if (!string.IsNullOrEmpty(dto.Password))
                user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);

            user.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return user;
        }

        public async Task DeleteUserAsync(Guid id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) throw new Exception("Usuario no encontrado");

            // Soft Delete preferiblemente, o hard delete si es requerimiento
            _context.Users.Remove(user); 
            await _context.SaveChangesAsync();
        }
    }
}
