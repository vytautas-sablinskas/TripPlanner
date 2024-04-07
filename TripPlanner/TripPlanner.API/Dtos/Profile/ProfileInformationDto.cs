namespace TripPlanner.API.Dtos.Profile;

public record ProfileInformationDto (
    string Name,
    string Surname,
    string Email,
    string Photo
);