namespace TripPlanner.API.Dtos.Authentication;

public record SuccessfulLoginDto(string AccessToken, string RefreshToken);