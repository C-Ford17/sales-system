using System;

namespace SistemaVentas.API.Models.DTOs.Users
{
    public class UserDto
    {
        public Guid Id { get; set; }
        public string Email { get; set; }
        public string FullName { get; set; }
        public string Phone { get; set; }
        public Guid RoleId { get; set; }
        public string RoleName { get; set; }
        public string? ProfileImageUrl { get; set; }
        public string Status { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
