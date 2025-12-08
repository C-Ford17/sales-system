using System;
using System.Collections.Generic;
using System.Text.Json;

namespace SistemaVentas.API.Models.Domain
{
    public class Role
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public JsonElement Permissions { get; set; }
        public DateTime CreatedAt { get; set; }

        // Navigation properties
        public ICollection<User> Users { get; set; } = new List<User>();
    }
}
