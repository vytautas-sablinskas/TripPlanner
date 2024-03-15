using Azure.Storage.Blobs;
using Azure.Storage.Sas;

namespace TripPlanner.API.Services.AzureBlobStorage;

public class AzureBlobStorageService : IAzureBlobStorageService
{
    private readonly BlobContainerClient _blobContainerClient;

    public AzureBlobStorageService(BlobContainerClient blobContainerClient)
    {
        _blobContainerClient = blobContainerClient;
    }

    public async Task<string> UploadImageAsync(IFormFile? image)
    {
        if (image == null ||
            image.Length == 0 ||
            !image.ContentType.StartsWith("image", StringComparison.OrdinalIgnoreCase))
            return "/default.jpg";

        var uniqueImageBlobName = $"{Guid.NewGuid()}{Path.GetExtension(image.FileName)}";
        var blobClient = _blobContainerClient.GetBlobClient(uniqueImageBlobName);

        using (var stream = image.OpenReadStream())
        {
            await blobClient.UploadAsync(stream);

            var permissions = BlobContainerSasPermissions.Read;
            var expiresOn = DateTimeOffset.MaxValue;
            var sasUri = _blobContainerClient.GenerateSasUri(permissions, expiresOn);
            var fullUriWithSas = new UriBuilder(sasUri)
            {
                Scheme = "https",
                Path = $"{_blobContainerClient.Name}/{uniqueImageBlobName}"
            }.Uri;

            return fullUriWithSas.ToString();
        }
    }
}