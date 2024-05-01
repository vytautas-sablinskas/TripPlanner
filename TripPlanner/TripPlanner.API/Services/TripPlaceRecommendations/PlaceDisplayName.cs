using Newtonsoft.Json;
using System.Diagnostics.CodeAnalysis;

namespace TripPlanner.API.Services.TripPlaceRecommendations;

[ExcludeFromCodeCoverage]
public class PlaceDisplayName
{
    [JsonProperty("text")]
    public string Text { get; set; }
}