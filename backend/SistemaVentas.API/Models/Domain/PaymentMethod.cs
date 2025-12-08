using System;
using System.Collections.Generic;

namespace SistemaVentas.API.Models.Domain
{
    public class PaymentMethod
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public ICollection<Sale> Sales { get; set; } = new List<Sale>();
    }
}
