using Newtonsoft.Json;

namespace TripPlanner.API.Services.TripPlaceRecommendations;

public class PlaceDisplayName
{
    [JsonProperty("text")]
    public string Text { get; set; }
}