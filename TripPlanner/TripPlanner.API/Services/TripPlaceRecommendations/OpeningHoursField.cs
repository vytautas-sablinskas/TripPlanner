using Newtonsoft.Json;

namespace TripPlanner.API.Services.TripPlaceRecommendations;

public class OpeningHoursField
{
    [JsonProperty("weekdayDescriptions")]
    public IEnumerable<string>? WeekdayDescriptions { get; set; }
}