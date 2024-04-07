namespace TripPlanner.API.Dtos.Profile;

public record ChangePasswordDto (
    string CurrentPassword,
    string NewPassword
);