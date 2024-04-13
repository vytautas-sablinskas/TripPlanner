using Newtonsoft.Json;

namespace TripPlanner.API.Services.TripPlaceRecommendations;

public class Place
{
    public List<string> Types { get; set; } = new List<string>();
    
    public string? GoogleMapsUri { get; set; }

    public double? Rating { get; set; }
    public int? UserRatingCount { get; set; }

    public List<PhotosField> Photos { get; set; } = new List<PhotosField>();

    [JsonProperty("displayName")]
    public PlaceDisplayName? DisplayName { get; set; }

    public string? FormattedAddress { get; set; }

    public string? InternationalPhoneNumber { get; set; }
}