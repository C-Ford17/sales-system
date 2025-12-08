using SistemaVentas.API.Data;
using SistemaVentas.API.Helpers;
using SistemaVentas.API.Models.Domain;
using SistemaVentas.API.Models.DTOs.Auth;
using SistemaVentas.API.Models.DTOs.Users;
using Microsoft.EntityFrameworkCore;

namespace SistemaVentas.API.Services
{
    public class AuthService
    {
        private readonly ApplicationDbContext _context;
        private readonly JwtTokenHandler _jwtTokenHandler;
        private readonly IConfiguration _configuration;

        public AuthService(ApplicationDbContext context, JwtTokenHandler jwtTokenHandler, IConfiguration configuration)
        {
            _context = context;
            _jwtTokenHandler = jwtTokenHandler;
            _configuration = configuration;
        }

        public async Task<ServiceResult<LoginResponse>> LoginAsync(string email, string password)
        {
            var user = await _context.Users
                .Include(u => u.Role)
                .FirstOrDefaultAsync(u => u.Email == email);

            if (user == null || !BCrypt.Net.BCrypt.Verify(password, user.PasswordHash))  // ← FIX 1
                return ServiceResult<LoginResponse>.Failure("Email o contraseña inválidos");

            if (user.Status != "active")
                return ServiceResult<LoginResponse>.Failure("Usuario inactivo");

            var accessToken = _jwtTokenHandler.GenerateToken(user);
            var refreshToken = _jwtTokenHandler.GenerateRefreshToken();

            var userDto = new UserDto
            {
                Id = user.Id,
                Email = user.Email,
                FullName = user.FullName,
                Phone = user.Phone ?? "",
                RoleId = user.RoleId,
                RoleName = user.Role?.Name ?? "",
                Status = user.Status,
                CreatedAt = user.CreatedAt
            };

            var response = new LoginResponse
            {
                AccessToken = accessToken,
                RefreshToken = refreshToken,
                User = userDto
            };

            // ← FIX 2: Crear instancia directa
            return new ServiceResult<LoginResponse>
            {
                Success = true,
                Data = response,
                Message = "Login exitoso"
            };
        }

        public async Task<ServiceResult<LoginResponse>> RefreshTokenAsync(string refreshToken)
        {
            return ServiceResult<LoginResponse>.Failure("No implementado");
        }
    }
}
