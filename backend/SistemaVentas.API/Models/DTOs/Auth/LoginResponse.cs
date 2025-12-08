using System;
using SistemaVentas.API.Models.DTOs.Users;

namespace SistemaVentas.API.Models.DTOs.Auth
{
    public class LoginResponse
    {
        public string AccessToken { get; set; }
        public string RefreshToken { get; set; }
        public UserDto User { get; set; }  // ← Ahora sí lo encuentra
    }
}
