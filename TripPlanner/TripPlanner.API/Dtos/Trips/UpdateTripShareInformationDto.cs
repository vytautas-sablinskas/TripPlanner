namespace TripPlanner.API.Dtos.Trips;

public record UpdateTripShareInformationDto(
    string? Title,
    string? DescriptionInHtml,
    IEnumerable<IFormFile>? Photos,
    IEnumerable<string>? ExistingPhotos
);