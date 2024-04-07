namespace TripPlanner.API.Dtos.Profile;

public record ChangeProfileInformationDto (
   string Name,
   string Surname,
   string Email
);