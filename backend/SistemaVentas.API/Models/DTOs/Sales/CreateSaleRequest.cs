using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace SistemaVentas.API.Models.DTOs.Sales
{
    public class CreateSaleRequest
    {
        [Required]
        public Guid PaymentMethodId { get; set; }

        public string Notes { get; set; }

        [Required]
        [MinLength(1)]
        public List<SaleDetailRequest> Items { get; set; } = new();
    }

    public class SaleDetailRequest
    {
        [Required]
        public Guid ProductId { get; set; }

        [Required]
        [Range(1, int.MaxValue)]
        public int Quantity { get; set; }

        [Range(0, double.MaxValue)]
        public decimal Discount { get; set; } = 0;
    }
}
