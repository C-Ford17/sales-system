using Microsoft.EntityFrameworkCore;
using SistemaVentas.API.Models.Domain;



namespace SistemaVentas.API.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) 
            : base(options)
        {
        }

        public DbSet<Role> Roles { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<PaymentMethod> PaymentMethods { get; set; }
        public DbSet<Sale> Sales { get; set; }
        public DbSet<SaleDetail> SaleDetails { get; set; }
        public DbSet<StockMovement> StockMovements { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Role configuration
            modelBuilder.Entity<Role>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasIndex(e => e.Name).IsUnique();
            });

            // User configuration
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasIndex(e => e.Email).IsUnique();
                entity.HasOne(e => e.Role)
                    .WithMany(r => r.Users)
                    .HasForeignKey(e => e.RoleId);
            });

            // Category configuration
            modelBuilder.Entity<Category>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasIndex(e => e.Name).IsUnique();
            });

            // Product configuration
            modelBuilder.Entity<Product>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasIndex(e => e.SKU).IsUnique();
                entity.HasOne(e => e.Category)
                    .WithMany(c => c.Products)
                    .HasForeignKey(e => e.CategoryId);
                entity.HasOne(e => e.CreatedByUser)
                    .WithMany(u => u.ProductsCreated)
                    .HasForeignKey(e => e.CreatedBy);
            });

            // PaymentMethod configuration
            modelBuilder.Entity<PaymentMethod>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasIndex(e => e.Name).IsUnique();
            });

            // Sale configuration
            modelBuilder.Entity<Sale>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasIndex(e => e.SaleNumber).IsUnique();
                entity.HasOne(e => e.User)
                    .WithMany(u => u.Sales)
                    .HasForeignKey(e => e.UserId);
                entity.HasOne(e => e.PaymentMethod)
                    .WithMany(p => p.Sales)
                    .HasForeignKey(e => e.PaymentMethodId);
            });

            // SaleDetail configuration
            modelBuilder.Entity<SaleDetail>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasOne(e => e.Sale)
                    .WithMany(s => s.Details)
                    .HasForeignKey(e => e.SaleId)
                    .OnDelete(DeleteBehavior.Cascade);
                entity.HasOne(e => e.Product)
                    .WithMany(p => p.SaleDetails)
                    .HasForeignKey(e => e.ProductId);
            });

            // StockMovement configuration
            modelBuilder.Entity<StockMovement>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasOne(e => e.Product)
                    .WithMany(p => p.StockMovements)
                    .HasForeignKey(e => e.ProductId);
                entity.HasOne(e => e.Sale)
                    .WithMany(s => s.StockMovements)
                    .HasForeignKey(e => e.SaleId)
                    .IsRequired(false);
                entity.HasOne(e => e.CreatedByUser)
                    .WithMany(u => u.StockMovements)
                    .HasForeignKey(e => e.CreatedBy);
            });
        }
    }
}
