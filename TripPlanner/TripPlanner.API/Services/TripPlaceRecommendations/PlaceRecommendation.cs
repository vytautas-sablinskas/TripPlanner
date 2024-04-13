namespace TripPlanner.API.Services.TripPlaceRecommendations;

public class PlaceRecommendation
{
    public required PlaceMinimal Place { get; set; }
    public double Score { get; set; }

    public string? PhotoUri { get; set; }
}