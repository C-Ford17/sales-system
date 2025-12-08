using Microsoft.AspNetCore.Mvc;
using SistemaVentas.API.Models.DTOs.Auth;
using SistemaVentas.API.Services;
using Microsoft.AspNetCore.Authorization;

namespace SistemaVentas.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AuthService _authService;

        public AuthController(AuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("login")]
        public async Task<ActionResult<LoginResponse>> Login(LoginRequest request)
        {
            var result = await _authService.LoginAsync(request.Email, request.Password);
            
            if (!result.Success)
                return Unauthorized(new { message = result.Message });

            return Ok(result.Data);
        }

        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            // Implementation for logout (invalidate token, etc)
            return Ok(new { message = "Logout successful" });
        }

        [HttpPost("refresh-token")]
        public async Task<ActionResult<LoginResponse>> RefreshToken([FromBody] string refreshToken)
        {
            var result = await _authService.RefreshTokenAsync(refreshToken);
            
            if (!result.Success)
                return Unauthorized(new { message = result.Message });

            return Ok(result.Data);
        }
        [Authorize]
        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto dto)
        {
            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null) return Unauthorized();

            var userId = Guid.Parse(userIdClaim);

            // Llamamos al servicio en vez de usar _context directamente
            var result = await _authService.ChangePasswordAsync(userId, dto.CurrentPassword, dto.NewPassword);

            if (!result)
            {
                return BadRequest("La contraseña actual es incorrecta o el usuario no existe.");
            }

            return Ok(new { message = "Contraseña actualizada correctamente." });
        }


    }
}
