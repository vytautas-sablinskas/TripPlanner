namespace TripPlanner.API.Services.TripPlaceRecommendations;

public class CategoryRecommendation
{
    public string Category { get; set; } = "Unknown Category";

    public IEnumerable<PlaceRecommendation> Recommendations { get; set; } = new List<PlaceRecommendation>();
}