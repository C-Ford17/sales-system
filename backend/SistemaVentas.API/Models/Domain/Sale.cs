using System;
using System.Collections.Generic;

namespace SistemaVentas.API.Models.Domain
{
    public class Sale
    {
        public Guid Id { get; set; }
        public string SaleNumber { get; set; }
        public Guid UserId { get; set; }
        public decimal TotalAmount { get; set; }
        public Guid PaymentMethodId { get; set; }
        public string Status { get; set; } = "completed"; // pending, completed, cancelled
        public string Notes { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public User User { get; set; }
        public PaymentMethod PaymentMethod { get; set; }
        public ICollection<SaleDetail> Details { get; set; } = new List<SaleDetail>();
        public ICollection<StockMovement> StockMovements { get; set; } = new List<StockMovement>();
    }
}
