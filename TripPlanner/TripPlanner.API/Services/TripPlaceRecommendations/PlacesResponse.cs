using System.Diagnostics.CodeAnalysis;

namespace TripPlanner.API.Services.TripPlaceRecommendations;

[ExcludeFromCodeCoverage]
public class PlacesResponse
{
    public IEnumerable<Place> Places { get; set; } = new List<Place>();
}