using Newtonsoft.Json;

namespace TripPlanner.API.Services.TripPlaceRecommendations;

public class Place
{
    public List<string> Types { get; set; } = new List<string>();
    
    public string? GoogleMapsUri { get; set; }

    public double? Rating { get; set; }

    public string? PriceLevel { get; set; }

    public int? UserRatingCount { get; set; }

    public List<PhotosField> Photos { get; set; } = new List<PhotosField>();

    [JsonProperty("primaryTypeDisplayName")]
    public PrimaryFieldType? PrimaryFieldType { get; set; }

    [JsonProperty("displayName")]
    public PlaceDisplayName? DisplayName { get; set; }

    [JsonProperty("regularOpeningHours")]
    public OpeningHoursField? OpeningHours { get; set; }

    [JsonProperty("location")]
    public required LocationField Location { get; set; }

    public string? FormattedAddress { get; set; }

    public string? WebsiteUri { get; set; }

    public string? InternationalPhoneNumber { get; set; }
}