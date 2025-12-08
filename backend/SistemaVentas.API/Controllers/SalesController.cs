using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SistemaVentas.API.Models.DTOs.Sales;
using SistemaVentas.API.Services;
using System.Security.Claims;

namespace SistemaVentas.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class SalesController : ControllerBase
    {
        private readonly ISaleService _saleService;

        public SalesController(ISaleService saleService)
        {
            _saleService = saleService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateSale([FromBody] CreateSaleRequest request)
        {
            try
            {
                var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
                var sale = await _saleService.CreateSaleAsync(request, userId);
                return Ok(new { sale.Id, sale.SaleNumber, sale.TotalAmount });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        [HttpGet]
        public async Task<IActionResult> GetSales(
            [FromQuery] string? number, 
            [FromQuery] DateTime? start, 
            [FromQuery] DateTime? end)
        {
            // 1. Obtener ID y Rol del usuario actual desde el Token
            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            var roleClaim = User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value;

            Guid? filterUserId = null;

            // 2. Si NO es Admin ni Supervisor, filtramos por su ID
            if (roleClaim != "Admin" && roleClaim != "Supervisor")
            {
                if (Guid.TryParse(userIdClaim, out Guid uid))
                {
                    filterUserId = uid;
                }
            }

            // 3. Pasamos el filterUserId al servicio
            var sales = await _saleService.GetSalesAsync(number, start, end, filterUserId);
            return Ok(sales);
        }


        [HttpGet("{id}")]
        public async Task<IActionResult> GetSale(Guid id)
        {
            try 
            {
                var sale = await _saleService.GetSaleByIdAsync(id);
                return Ok(sale);
            }
            catch (Exception ex)
            {
                return NotFound(ex.Message);
            }
        }
    }
}
