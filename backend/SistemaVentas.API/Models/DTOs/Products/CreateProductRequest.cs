using System;
using System.ComponentModel.DataAnnotations;

namespace SistemaVentas.API.Models.DTOs.Products
{
    public class CreateProductRequest
    {
        [Required]
        [MaxLength(255)]
        public string Name { get; set; }

        public string Description { get; set; }

        [Required]
        [Range(0.01, double.MaxValue)]
        public decimal Price { get; set; }

        [Range(0, double.MaxValue)]
        public decimal Cost { get; set; }

        [Required]
        [Range(0, int.MaxValue)]
        public int QuantityInStock { get; set; }

        [Range(1, int.MaxValue)]
        public int MinStock { get; set; } = 10;

        [Required]
        public Guid CategoryId { get; set; }

        [Required]
        [MaxLength(100)]
        public string SKU { get; set; }

        public IFormFile? Image { get; set; } 
    }
}
