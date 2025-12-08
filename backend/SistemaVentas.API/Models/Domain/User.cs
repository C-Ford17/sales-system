using System;
using System.Collections.Generic;

namespace SistemaVentas.API.Models.Domain
{
    public class User
    {
        public Guid Id { get; set; }
        public string Email { get; set; }
        public string PasswordHash { get; set; }
        public string FullName { get; set; }
        public string Phone { get; set; }
        public string? ProfileImageUrl { get; set; }
        public Guid RoleId { get; set; }
        public string Status { get; set; } = "active"; // active, inactive
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public Role Role { get; set; }
        public ICollection<Sale> Sales { get; set; } = new List<Sale>();
        public ICollection<Product> ProductsCreated { get; set; } = new List<Product>();
        public ICollection<StockMovement> StockMovements { get; set; } = new List<StockMovement>();
    }
}
