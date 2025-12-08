using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace SistemaVentas.API.Models.DTOs.Sales
{
    public class CreateSaleRequest
    {
        [Required]
        public string PaymentMethod { get; set; } // Cash, Card, etc.

        public string CustomerName { get; set; } // Opcional

        [Required]
        public List<CreateSaleDetailDto> Details { get; set; } 
    }

    public class CreateSaleDetailDto 
    {
        [Required]
        public Guid ProductId { get; set; }

        [Required]
        [Range(1, int.MaxValue)]
        public int Quantity { get; set; }
    }
}
