using System.ComponentModel.DataAnnotations;

namespace SistemaVentas.API.Models.DTOs.Auth
{
    public class ChangePasswordDto
    {
        [Required] public string CurrentPassword { get; set; }
        [Required, MinLength(6)] public string NewPassword { get; set; }
    }
}
