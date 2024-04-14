using Newtonsoft.Json;

namespace TripPlanner.API.Services.TripPlaceRecommendations;

public class PrimaryFieldType
{
    [JsonProperty("text")]
    public string Type { get; set; }
}