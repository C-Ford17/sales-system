using ClosedXML.Excel;
using SistemaVentas.API.Models.DTOs.Sales;

namespace SistemaVentas.API.Services
{
    public class ExcelService
    {
        public byte[] GenerateSalesExcel(List<SaleDto> sales, DateTime start, DateTime end)
        {
            using (var workbook = new XLWorkbook())
            {
                var worksheet = workbook.Worksheets.Add("Ventas");

                // Cabeceras
                worksheet.Cell(1, 1).Value = "Reporte de Ventas";
                worksheet.Range(1, 1, 1, 6).Merge().Style.Font.Bold = true;
                
                worksheet.Cell(2, 1).Value = $"Periodo: {start:dd/MM/yyyy} - {end:dd/MM/yyyy}";

                // Títulos de columnas (Fila 4)
                int row = 4;
                worksheet.Cell(row, 1).Value = "N° Venta";
                worksheet.Cell(row, 2).Value = "Fecha";
                worksheet.Cell(row, 3).Value = "Cliente/Vendedor"; // Usamos UserName por ahora
                worksheet.Cell(row, 4).Value = "Método Pago";
                worksheet.Cell(row, 5).Value = "Total";
                worksheet.Cell(row, 6).Value = "Estado";
                
                // Estilo Cabecera
                var headerRange = worksheet.Range(row, 1, row, 6);
                headerRange.Style.Font.Bold = true;
                headerRange.Style.Fill.BackgroundColor = XLColor.LightGray;
                headerRange.Style.Border.BottomBorder = XLBorderStyleValues.Thin;

                // Datos
                row++;
                foreach (var sale in sales)
                {
                    worksheet.Cell(row, 1).Value = sale.SaleNumber;
                    worksheet.Cell(row, 2).Value = sale.CreatedAt.ToLocalTime(); // Ajustar zona horaria si es necesario
                    worksheet.Cell(row, 3).Value = sale.UserName;
                    worksheet.Cell(row, 4).Value = sale.PaymentMethodName;
                    worksheet.Cell(row, 5).Value = sale.TotalAmount;
                    worksheet.Cell(row, 5).Style.NumberFormat.Format = "$ #,##0.00"; // Formato Moneda
                    worksheet.Cell(row, 6).Value = sale.Status;
                    row++;
                }

                // Ajustar ancho de columnas
                worksheet.Columns().AdjustToContents();

                using (var stream = new MemoryStream())
                {
                    workbook.SaveAs(stream);
                    return stream.ToArray();
                }
            }
        }
    }
}
