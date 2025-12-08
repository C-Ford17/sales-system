public class UpdateUserDto
{
    public string? FullName { get; set; }
    public string? Email { get; set; }
    public Guid? RoleId { get; set; }
    public string? Phone { get; set; }
    public string? Status { get; set; } // active, inactive
    public string? Password { get; set; } // Opcional, solo si se quiere resetear
}
