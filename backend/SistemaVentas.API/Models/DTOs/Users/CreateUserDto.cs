using System.ComponentModel.DataAnnotations;

namespace SistemaVentas.API.Models.DTOs.Users
{
    public class CreateUserDto
    {
        [Required] public string FullName { get; set; }
        [Required, EmailAddress] public string Email { get; set; }
        [Required, MinLength(6)] public string Password { get; set; }
        [Required] public Guid RoleId { get; set; } // El admin elige el rol
    }
}
