using Azure.Storage.Blobs;
using System.Diagnostics.CodeAnalysis;

namespace TripPlanner.API.Wrappers;

[ExcludeFromCodeCoverage]
public class BlobClientWrapper : IBlobClientWrapper
{
    private readonly BlobClient _blobClient;

    public BlobClientWrapper(BlobClient blobClient)
    {
        _blobClient = blobClient;
    }

    public async Task UploadAsync(Stream stream)
    {
        await _blobClient.UploadAsync(stream);
    }
}