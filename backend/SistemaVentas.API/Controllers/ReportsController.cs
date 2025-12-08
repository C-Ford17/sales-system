using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SistemaVentas.API.Services;

namespace SistemaVentas.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ReportsController : ControllerBase
    {
        private readonly ExcelService _excelService;
        private readonly ISaleService _saleService;

        public ReportsController(ExcelService excelService, ISaleService saleService)
        {
            _excelService = excelService;
            _saleService = saleService;
        }

        [HttpGet("sales-excel")]
        public async Task<IActionResult> DownloadSalesExcel([FromQuery] DateTime start, [FromQuery] DateTime end)
        {
            // Obtener datos (reutilizando el filtro de ventas)
            // Nota: Pasamos null en filterNumber y userId para traer todo lo del rango
            // Si quieres filtrar por usuario (ej. Empleado solo ve sus ventas), inyecta lógica de usuario aquí
            var sales = await _saleService.GetSalesAsync(null, start, end, null);

            if (sales == null || !sales.Any())
                return BadRequest("No hay datos para generar el reporte en este rango.");

            var fileContent = _excelService.GenerateSalesExcel(sales, start, end);

            string fileName = $"Reporte_Ventas_{start:yyyyMMdd}_{end:yyyyMMdd}.xlsx";
            return File(fileContent, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", fileName);
        }
    }
}
