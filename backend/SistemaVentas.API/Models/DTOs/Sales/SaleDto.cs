using System;
using System.Collections.Generic;

namespace SistemaVentas.API.Models.DTOs.Sales
{
    public class SaleDto
    {
        public Guid Id { get; set; }
        public string SaleNumber { get; set; }
        public Guid UserId { get; set; }
        public string UserName { get; set; }
        public decimal TotalAmount { get; set; }
        public Guid PaymentMethodId { get; set; }
        public string PaymentMethodName { get; set; }
        public string Status { get; set; }
        public string Notes { get; set; }
        public DateTime CreatedAt { get; set; }
        public List<SaleDetailDto> Details { get; set; } = new();
    }

    public class SaleDetailDto
    {
        public Guid Id { get; set; }
        public Guid ProductId { get; set; }
        public string ProductName { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal Subtotal { get; set; }
        public decimal Discount { get; set; }
    }
}
