namespace TripPlanner.API.Services.AzureBlobStorage;

public interface IAzureBlobStorageService
{
    Task<string> UploadImageAsync(IFormFile? image);
}