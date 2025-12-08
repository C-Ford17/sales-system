using System;

namespace SistemaVentas.API.Models.Domain
{
    public class StockMovement
    {
        public Guid Id { get; set; }
        public Guid ProductId { get; set; }
        public string MovementType { get; set; } // sale, purchase, adjustment, return
        public int Quantity { get; set; }
        public string Reason { get; set; }
        public Guid? SaleId { get; set; }
        public Guid CreatedBy { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public Product Product { get; set; }
        public Sale Sale { get; set; }
        public User CreatedByUser { get; set; }
    }
}
