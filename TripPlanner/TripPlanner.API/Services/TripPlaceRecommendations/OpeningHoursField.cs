using Newtonsoft.Json;
using System.Diagnostics.CodeAnalysis;

namespace TripPlanner.API.Services.TripPlaceRecommendations;

[ExcludeFromCodeCoverage]
public class OpeningHoursField
{
    [JsonProperty("weekdayDescriptions")]
    public IEnumerable<string>? WeekdayDescriptions { get; set; }
}