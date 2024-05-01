using Azure;
using Azure.Storage.Sas;

namespace TripPlanner.API.Wrappers;

public interface IBlobContainerClientWrapper
{
    string Name { get; set; }

    IBlobClientWrapper GetBlobClient(string blobName);

    Uri GenerateSasUri(BlobContainerSasPermissions permissions, DateTimeOffset expiresOn);

    Task<Response> DeleteBlobAsync(string blobName);
}