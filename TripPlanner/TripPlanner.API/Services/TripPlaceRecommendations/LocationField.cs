using System.Diagnostics.CodeAnalysis;

namespace TripPlanner.API.Services.TripPlaceRecommendations;

[ExcludeFromCodeCoverage]
public class LocationField
{
    public double Latitude { get; set; }

    public double Longitude { get; set; }
}