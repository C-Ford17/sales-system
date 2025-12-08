using System;
using System.ComponentModel.DataAnnotations;

namespace SistemaVentas.API.Models.DTOs.Users
{
    public class CreateUserRequest
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        [MinLength(6)]
        public string Password { get; set; }

        [Required]
        public string FullName { get; set; }

        public string Phone { get; set; }

        [Required]
        public Guid RoleId { get; set; }
    }
}
