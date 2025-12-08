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
                // 1. Asegurar que existan los ROLES
                // ------------------------------------------------
                var emptyPermissions = JsonDocument.Parse("{}").RootElement;

                // Buscamos si existe el rol Admin, si no, lo creamos
                var adminRole = context.Roles.FirstOrDefault(r => r.Name == "Admin");
                if (adminRole == null)
                {
                    adminRole = new Role
                    {
                        Name = "Admin",
                        Description = "Administrador del Sistema",
                        Permissions = emptyPermissions
                    };
                    context.Roles.Add(adminRole);
                }

                // Buscamos si existe el rol Employee, si no, lo creamos
                var employeeRole = context.Roles.FirstOrDefault(r => r.Name == "Employee");
                if (employeeRole == null)
                {
                    employeeRole = new Role
                    {
                        Name = "Employee",
                        Description = "Empleado de Ventas",
                        Permissions = emptyPermissions
                    };
                    context.Roles.Add(employeeRole);
                }

                // Guardamos los roles para asegurar que tengan IDs generados
                context.SaveChanges();

                // 2. Asegurar que exista el USUARIO ADMIN
                // ------------------------------------------------
                if (!context.Users.Any(u => u.Email == "admin@sales.com"))
                {
                    var adminUser = new User
                    {
                        Email = "admin@sales.com",
                        FullName = "Admin Principal",
                        // Hasheamos la contraseña
                        PasswordHash = BCrypt.Net.BCrypt.HashPassword("admin123"),
                        RoleId = adminRole.Id,
                        Status = "active",
                        Phone = "3001234567", // Agregamos teléfono dummy para evitar el error anterior
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    };

                    context.Users.Add(adminUser);
                    context.SaveChanges();
                }
            }
        }
    }
}
