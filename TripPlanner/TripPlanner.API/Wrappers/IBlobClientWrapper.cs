namespace TripPlanner.API.Wrappers;

public interface IBlobClientWrapper
{
    Task UploadAsync(Stream stream);
}