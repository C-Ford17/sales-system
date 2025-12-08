using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SistemaVentas.API.Models.DTOs.Users;
using SistemaVentas.API.Services;
using Microsoft.AspNetCore.Authorization;

namespace SistemaVentas.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    // [Authorize(Roles = "Admin")] // IMPORTANTE: Solo Admin debería entrar aquí
    public class UsersController : ControllerBase
    {
        private readonly UserService _userService;

        public UsersController(UserService userService)
        {
            _userService = userService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            return Ok(await _userService.GetAllUsersAsync());
        }

        [HttpPost]
        public async Task<IActionResult> Create(CreateUserDto dto)
        {
            try {
                var user = await _userService.CreateUserAsync(dto);
                return Ok(user);
            } catch (Exception ex) {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, UpdateUserDto dto)
        {
            try {
                var user = await _userService.UpdateUserAsync(id, dto);
                return Ok(user);
            } catch (Exception ex) {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            try {
                await _userService.DeleteUserAsync(id);
                return Ok(new { message = "Usuario eliminado" });
            } catch (Exception ex) {
                return BadRequest(new { message = ex.Message });
            }
        }
        [Authorize]
        [HttpPut("profile")]
        public async Task<IActionResult> UpdateProfile([FromForm] UpdateProfileDto dto)
        {
            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null) return Unauthorized();

            var userId = Guid.Parse(userIdClaim);
            
            try {
                // 1. Convertir UpdateProfileDto -> UpdateUserDto
                var fullDto = new UpdateUserDto
                {
                    FullName = dto.FullName,
                    Phone = dto.Phone,
                    // Los demás campos quedan nulos (Email, Status, RoleId)
                    // Asegúrate que UpdateUserDto permita nulos (string?)
                };

                // 2. Llamar al servicio con el tipo correcto
                var user = await _userService.UpdateUserAsync(userId, fullDto, dto.Image);
                return Ok(user);

            } catch (Exception ex) {
                return BadRequest(ex.Message);
            }
        }


    }
}
