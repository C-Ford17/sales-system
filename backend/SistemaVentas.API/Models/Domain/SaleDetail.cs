using System;

namespace SistemaVentas.API.Models.Domain
{
    public class SaleDetail
    {
        public Guid Id { get; set; }
        public Guid SaleId { get; set; }
        public Guid ProductId { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal Subtotal { get; set; }
        public decimal Discount { get; set; } = 0;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public Sale Sale { get; set; }
        public Product Product { get; set; }
    }
}
