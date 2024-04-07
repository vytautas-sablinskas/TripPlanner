namespace TripPlanner.API.Services.AzureBlobStorage;

public interface IAzureBlobStorageService
{
    Task<(bool, string)> UploadFileAsync(IFormFile image);

    Task<string> UploadImageAsync(IFormFile? image);

    Task DeleteFileAsync(string uri);
}