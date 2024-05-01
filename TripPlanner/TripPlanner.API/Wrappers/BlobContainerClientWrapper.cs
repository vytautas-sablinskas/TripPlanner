using Azure;
using Azure.Storage.Blobs;
using Azure.Storage.Sas;
using System.Diagnostics.CodeAnalysis;
using TripPlanner.API.Services.AzureBlobStorage;

namespace TripPlanner.API.Wrappers;

[ExcludeFromCodeCoverage]
public class BlobContainerClientWrapper : IBlobContainerClientWrapper
{
    private readonly BlobContainerClient _blobContainerClient;

    public string Name { get; set; }

    public BlobContainerClientWrapper(BlobContainerClient blobContainerClient)
    {
        _blobContainerClient = blobContainerClient;
        Name = blobContainerClient.Name;
    }

    public IBlobClientWrapper GetBlobClient(string blobName)
    {
        var client = _blobContainerClient.GetBlobClient(blobName);

        return new BlobClientWrapper(client);
    }

    public Uri GenerateSasUri(BlobContainerSasPermissions permissions, DateTimeOffset expiresOn)
    {
        return _blobContainerClient.GenerateSasUri(permissions, expiresOn);
    }

    public async Task<Response> DeleteBlobAsync(string blobName)
    {
        return await _blobContainerClient.DeleteBlobAsync(blobName);
    }
}