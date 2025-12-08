using System;

namespace SistemaVentas.API.Models.DTOs.Products
{
    public class ProductDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        public decimal Cost { get; set; }
        public int QuantityInStock { get; set; }
        public int MinStock { get; set; }
        public Guid CategoryId { get; set; }
        public string CategoryName { get; set; }
        public string SKU { get; set; }
        public string Status { get; set; }
        public string ImageUrl { get; set; }
        public DateTime CreatedAt { get; set; }
        public bool IsLowStock => QuantityInStock < MinStock;
    }
}
