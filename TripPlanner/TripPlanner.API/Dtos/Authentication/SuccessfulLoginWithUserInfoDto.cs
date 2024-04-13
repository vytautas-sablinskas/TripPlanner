namespace TripPlanner.API.Dtos.Authentication;

public record SuccessfulLoginWithUserInfoDto(string AccessToken, string RefreshToken, string Id);