using Newtonsoft.Json;
using System.Diagnostics.CodeAnalysis;

namespace TripPlanner.API.Services.TripPlaceRecommendations;

[ExcludeFromCodeCoverage]
public class PrimaryFieldType
{
    [JsonProperty("text")]
    public string Type { get; set; }
}