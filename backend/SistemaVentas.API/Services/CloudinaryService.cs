using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.Extensions.Options;
using SistemaVentas.API.Helpers;

namespace SistemaVentas.API.Services
{
    public class CloudinaryService
    {
        private readonly Cloudinary? _cloudinary;
        private readonly ILogger<CloudinaryService> _logger;

        public CloudinaryService(IOptions<CloudinarySettings> config, ILogger<CloudinaryService> logger)
        {
            _logger = logger;
            
            // Solo inicializar Cloudinary si las credenciales están configuradas
            if (!string.IsNullOrEmpty(config.Value.CloudName) && 
                !string.IsNullOrEmpty(config.Value.ApiKey) && 
                !string.IsNullOrEmpty(config.Value.ApiSecret) &&
                !config.Value.CloudName.StartsWith("${")) // Evitar placeholders no reemplazados
            {
                var acc = new Account(
                    config.Value.CloudName,
                    config.Value.ApiKey,
                    config.Value.ApiSecret
                );
                _cloudinary = new Cloudinary(acc);
                _logger.LogInformation("Cloudinary configurado correctamente");
            }
            else
            {
                _logger.LogWarning("Cloudinary NO está configurado. Las imágenes no se subirán a la nube.");
            }
        }

        public async Task<string?> UploadImageAsync(IFormFile? file)
        {
            // Si no hay archivo, retornar null
            if (file == null || file.Length == 0) 
                return null;

            // Si Cloudinary no está configurado, retornar null (el producto se crea sin imagen)
            if (_cloudinary == null)
            {
                _logger.LogWarning("Intento de subir imagen pero Cloudinary no está configurado");
                return null;
            }

            try
            {
                using (var stream = file.OpenReadStream())
                {
                    var uploadParams = new ImageUploadParams
                    {
                        File = new FileDescription(file.FileName, stream),
                        Transformation = new Transformation().Height(500).Width(500).Crop("fill").Gravity("face")
                    };

                    var uploadResult = await _cloudinary.UploadAsync(uploadParams);

                    // Verificar si el upload fue exitoso
                    if (uploadResult?.SecureUrl != null)
                    {
                        return uploadResult.SecureUrl.ToString();
                    }
                    else
                    {
                        _logger.LogError("Error al subir imagen: {Error}", uploadResult?.Error?.Message ?? "Unknown error");
                        return null;
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Excepción al subir imagen a Cloudinary");
                return null;
            }
        }

        public async Task<DeletionResult?> DeleteImageAsync(string publicId)
        {
            if (_cloudinary == null) return null;
            
            var deleteParams = new DeletionParams(publicId);
            return await _cloudinary.DestroyAsync(deleteParams);
        }
    }
}
