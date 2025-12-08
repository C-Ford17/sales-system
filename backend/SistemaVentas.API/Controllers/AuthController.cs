using Microsoft.AspNetCore.Mvc;
using SistemaVentas.API.Models.DTOs.Auth;
using SistemaVentas.API.Services;

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
    }
}
