using System.Diagnostics.CodeAnalysis;

namespace TripPlanner.API.Services.TripPlaceRecommendations;

[ExcludeFromCodeCoverage]
public class CategoryRecommendation
{
    public string Category { get; set; } = "Unknown Category";

    public IEnumerable<PlaceRecommendation> Recommendations { get; set; } = new List<PlaceRecommendation>();
}