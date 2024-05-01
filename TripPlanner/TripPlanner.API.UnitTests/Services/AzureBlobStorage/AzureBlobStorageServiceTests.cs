using Azure.Storage.Blobs;
using Azure.Storage.Sas;
using Microsoft.AspNetCore.Http;
using Moq;
using TripPlanner.API.Services.AzureBlobStorage;
using TripPlanner.API.Wrappers;

namespace TripPlanner.API.UnitTests.Services.AzureBlobStorage;

public class AzureBlobStorageServiceTests
{
    private readonly Mock<IBlobContainerClientWrapper> _blobClientMock;
    private readonly AzureBlobStorageService _service;

    public AzureBlobStorageServiceTests()
    {
        _blobClientMock = new Mock<IBlobContainerClientWrapper>();
        _service = new AzureBlobStorageService(_blobClientMock.Object);
    }

    [Fact]
    public async Task UploadFileAsync_SuccessfulUpload_ReturnsTrueAndUrl()
    {
        var imageMock = new Mock<IFormFile>();
        var clientWrapper = new Mock<IBlobClientWrapper>();

        var stream = new MemoryStream();
        imageMock.Setup(x => x.OpenReadStream()).Returns(stream);

        var blobUri = new Uri("https://example.blob.core.windows.net/container/image.jpg");

        _blobClientMock.Setup(x => x.GetBlobClient(It.IsAny<string>()))
            .Returns(clientWrapper.Object);
        _blobClientMock.Setup(x => x.GenerateSasUri(It.IsAny<BlobContainerSasPermissions>(), It.IsAny<DateTimeOffset>()))
            .Returns(new Uri("https://example.blob.core.windows.net/container/sasToken"));
        _blobClientMock.Setup(v => v.Name)
            .Returns("blobName");

        var result = await _service.UploadFileAsync(imageMock.Object);

        Assert.True(result.Item1);
        Assert.NotEmpty(result.Item2);
    }

    [Fact]
    public async Task UploadImageAsync_SuccessfulUpload_ReturnsCorrectUri()
    {
        var imageMock = new Mock<IFormFile>();
        imageMock.Setup(v => v.ContentType)
            .Returns("image");
        imageMock.Setup(v => v.Length)
            .Returns(1);
        var clientWrapper = new Mock<IBlobClientWrapper>();

        var stream = new MemoryStream();
        imageMock.Setup(x => x.OpenReadStream()).Returns(stream);

        var blobUri = new Uri("https://example.blob.core.windows.net/container/image.jpg");

        _blobClientMock.Setup(x => x.GetBlobClient(It.IsAny<string>()))
            .Returns(clientWrapper.Object);
        _blobClientMock.Setup(x => x.GenerateSasUri(It.IsAny<BlobContainerSasPermissions>(), It.IsAny<DateTimeOffset>()))
            .Returns(new Uri("https://example.blob.core.windows.net/container/sasToken"));
        _blobClientMock.Setup(v => v.Name)
            .Returns("blobName");

        var result = await _service.UploadImageAsync(imageMock.Object);

        Assert.True(!string.IsNullOrEmpty(result));
        Assert.True(result != "/default.jpg");
    }

    [Fact]
    public async Task DeleteFileAsync_ShouldCallDeleteBlobMethod()
    {
        await _service.DeleteFileAsync("https://youraccount.blob.core.windows.net/container/blobName?sasToken");

        _blobClientMock.Verify(v => v.DeleteBlobAsync(It.IsAny<string>()), Times.Once);
    }
}