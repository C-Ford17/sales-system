using Microsoft.EntityFrameworkCore;
using SistemaVentas.API.Models.Domain;
using BCrypt.Net;
using System.Text.Json;

namespace SistemaVentas.API.Data
{
    public static class SeedData
    {
        public static void Initialize(IServiceProvider serviceProvider)
        {
            using (var context = new ApplicationDbContext(
                serviceProvider.GetRequiredService<DbContextOptions<ApplicationDbContext>>()))
            {
                // 1. Roles y Usuario Admin (Tu código actual)
                // ------------------------------------------------
                var emptyPermissions = JsonDocument.Parse("{}").RootElement;
                
                var adminRole = context.Roles.FirstOrDefault(r => r.Name == "Admin");
                if (adminRole == null)
                {
                    adminRole = new Role { Name = "Admin", Description = "Administrador", Permissions = emptyPermissions };
                    context.Roles.Add(adminRole);
                }

                var employeeRole = context.Roles.FirstOrDefault(r => r.Name == "Employee");
                if (employeeRole == null)
                {
                    employeeRole = new Role { Name = "Employee", Description = "Vendedor", Permissions = emptyPermissions };
                    context.Roles.Add(employeeRole);
                }
                
                context.SaveChanges(); // Guardar roles

                var adminUser = context.Users.FirstOrDefault(u => u.Email == "admin@sales.com");
                if (adminUser == null)
                {
                    adminUser = new User
                    {
                        Email = "admin@sales.com",
                        FullName = "Admin Principal",
                        PasswordHash = BCrypt.Net.BCrypt.HashPassword("admin123"),
                        RoleId = adminRole.Id,
                        Status = "active",
                        Phone = "3001234567",
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    };
                    context.Users.Add(adminUser);
                    context.SaveChanges(); // Guardar usuario
                }

                // 2. CATEGORÍAS
                // ------------------------------------------------
                if (!context.Categories.Any())
                {
                    var categories = new List<Category>
                    {
                        new Category { Name = "Electrónica", Description = "Gadgets y dispositivos", CreatedAt = DateTime.UtcNow },
                        new Category { Name = "Ropa", Description = "Moda masculina y femenina", CreatedAt = DateTime.UtcNow },
                        new Category { Name = "Hogar", Description = "Artículos para el hogar", CreatedAt = DateTime.UtcNow }
                    };
                    context.Categories.AddRange(categories);
                    context.SaveChanges();
                }

                // Recuperar categorías para asignar a productos
                var electronics = context.Categories.First(c => c.Name == "Electrónica");
                var clothing = context.Categories.First(c => c.Name == "Ropa");

                // 3. PRODUCTOS
                // ------------------------------------------------
                if (!context.Products.Any())
                {
                    var products = new List<Product>
                    {
                        new Product {
                            Name = "Laptop Pro X",
                            Description = "Laptop de alto rendimiento 16GB RAM",
                            Price = 1200.00m,
                            Cost = 900.00m,
                            QuantityInStock = 15,
                            MinStock = 5,
                            CategoryId = electronics.Id,
                            SKU = "ELEC-001",
                            Status = "active",
                            ImageUrl = "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80",
                            CreatedBy = adminUser.Id
                        },
                        new Product {
                            Name = "Mouse Inalámbrico",
                            Description = "Mouse ergonómico 2.4Ghz",
                            Price = 25.50m,
                            Cost = 12.00m,
                            QuantityInStock = 50,
                            MinStock = 10,
                            CategoryId = electronics.Id,
                            SKU = "ELEC-002",
                            Status = "active",
                            ImageUrl = "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80",
                            CreatedBy = adminUser.Id
                        },
                        new Product {
                            Name = "Camiseta Básica",
                            Description = "100% Algodón",
                            Price = 15.00m,
                            Cost = 5.00m,
                            QuantityInStock = 100,
                            MinStock = 20,
                            CategoryId = clothing.Id,
                            SKU = "ROPA-001",
                            Status = "active",
                            ImageUrl = "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80",
                            CreatedBy = adminUser.Id
                        },
                        new Product {
                            Name = "Monitor 4K",
                            Description = "Pantalla 27 pulgadas",
                            Price = 350.00m,
                            Cost = 250.00m,
                            QuantityInStock = 2, // Stock bajo para probar alerta
                            MinStock = 5,
                            CategoryId = electronics.Id,
                            SKU = "ELEC-003",
                            Status = "inactive",
                            ImageUrl = "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80",
                            CreatedBy = adminUser.Id
                        }
                    };
                    context.Products.AddRange(products);
                    context.SaveChanges();
                }
            }
        }
    }
}
