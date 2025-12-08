using System;
using System.Collections.Generic;

namespace SistemaVentas.API.Models.Domain
{
    public class Category
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Status { get; set; } = "active";
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public ICollection<Product> Products { get; set; } = new List<Product>();
    }
}
