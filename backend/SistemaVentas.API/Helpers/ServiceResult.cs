using System.Collections.Generic;

namespace SistemaVentas.API.Helpers
{
    public class ServiceResult<T>
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
        public T? Data { get; set; }
        public List<string> Errors { get; set; } = new();

        public static ServiceResult<T> CreateSuccess(T data, string message = "Operación exitosa")
        {
            return new ServiceResult<T>
            {
                Success = true,
                Message = message,
                Data = data
            };
        }

        public static ServiceResult<T> Failure(string message)
        {
            return new ServiceResult<T>
            {
                Success = false,
                Message = message
            };
        }

        public static ServiceResult<T> Failure(List<string> errors, string message = "Errores de validación")
        {
            return new ServiceResult<T>
            {
                Success = false,
                Message = message,
                Errors = errors
            };
        }
    }
}
