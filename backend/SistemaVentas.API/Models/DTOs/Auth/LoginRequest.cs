using System.ComponentModel.DataAnnotations;

namespace SistemaVentas.API.Models.DTOs.Auth
{
    public class LoginRequest
    {
        [Required(ErrorMessage = "El email es requerido")]
        [EmailAddress]
        public string Email { get; set; }

        [Required(ErrorMessage = "La contraseña es requerida")]
        [MinLength(6)]
        public string Password { get; set; }
    }
}
