namespace TripPlanner.API.Services.TripPlaceRecommendations;

public class PlaceMinimal
{
    public List<string> Types { get; set; } = new List<string>();

    public string? GoogleMapsUri { get; set; }

    public double? Rating { get; set; }

    public int? UserRatingCount { get; set; }

    public string? Website { get; set; }

    public string? FormattedAddress { get; set; }

    public string? InternationalPhoneNumber { get; set; }

    public IEnumerable<string>? WeekdayDescriptions { get; set; }

    public string? DisplayName { get; set; }

    public string? PrimaryType { get; set; }
}