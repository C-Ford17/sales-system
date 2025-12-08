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
        private readonly CloudinaryService _cloudinaryService;
        public UserService(ApplicationDbContext context, CloudinaryService cloudinaryService)
        {
            _context = context;
            _cloudinaryService = cloudinaryService;
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

        public async Task<User> UpdateUserAsync(Guid id, UpdateUserDto dto, IFormFile? imageFile = null)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) throw new Exception("Usuario no encontrado");
            if (dto.FullName != null) user.FullName = dto.FullName;
            if (dto.Email != null) user.Email = dto.Email;
            if (dto.Status != null) user.Status = dto.Status;
            if (dto.Phone != null) user.Phone = dto.Phone;
            if (dto.RoleId.HasValue) user.RoleId = dto.RoleId.Value;
            if (imageFile != null)
            {
                user.ProfileImageUrl = await _cloudinaryService.UploadImageAsync(imageFile);
            }
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
