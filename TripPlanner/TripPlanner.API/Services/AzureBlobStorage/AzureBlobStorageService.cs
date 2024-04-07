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

    public async Task<(bool, string)> UploadFileAsync(IFormFile image)
    {
        var uniqueImageBlobName = $"{Guid.NewGuid()}{Path.GetExtension(image.FileName)}";

        try
        {
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

                return (true, fullUriWithSas.ToString());
            }
        }
        catch
        {
            return (false, "");
        }
    }

    public async Task<string> UploadImageAsync(IFormFile? image)
    {
        if (image == null ||
            image.Length == 0 ||
            !image.ContentType.StartsWith("image", StringComparison.OrdinalIgnoreCase))
            return "/default.jpg";

        var (isUploaded, uri) = await UploadFileAsync(image);
        if (!isUploaded)
        {
            return "/default.jpg";
        }

        return uri;
    }

    public async Task DeleteFileAsync(string uri)
    {
        try
        {
            var blobWithSasName = uri.Substring(uri.LastIndexOf('/') + 1);
            var blobName = blobWithSasName.Split('?')[0];
            await _blobContainerClient.DeleteBlobAsync(blobName);
        } catch {}
    }
}