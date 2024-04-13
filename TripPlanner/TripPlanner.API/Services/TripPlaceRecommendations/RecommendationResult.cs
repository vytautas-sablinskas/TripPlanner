namespace TripPlanner.API.Services.TripPlaceRecommendations;

public class RecommendationResult
{
    public List<string> Types { get; set; } = new List<string>();

    public string? GoogleMapsUri { get; set; }

    public double? Rating { get; set; }
    public int? UserRatingCount { get; set; }

    public string? PhotoUri { get; set; }
}