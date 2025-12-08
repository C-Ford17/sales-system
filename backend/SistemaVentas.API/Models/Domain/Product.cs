using System;
using System.Collections.Generic;

namespace SistemaVentas.API.Models.Domain
{
    public class Product
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        public decimal Cost { get; set; }
        public int QuantityInStock { get; set; }
        public int MinStock { get; set; } = 10;
        public Guid CategoryId { get; set; }
        public string SKU { get; set; }
        public string Status { get; set; } = "active"; // active, inactive, discontinued
        public string ImageUrl { get; set; }
        public Guid CreatedBy { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public Category Category { get; set; }
        public User CreatedByUser { get; set; }
        public ICollection<SaleDetail> SaleDetails { get; set; } = new List<SaleDetail>();
        public ICollection<StockMovement> StockMovements { get; set; } = new List<StockMovement>();
    }
}
