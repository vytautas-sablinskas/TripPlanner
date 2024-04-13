namespace TripPlanner.API.Services.TripPlaceRecommendations;

public class Place
{
    public List<string> Types { get; set; } = new List<string>();
    
    public string? GoogleMapsUri { get; set; }

    public double? Rating { get; set; }
    public int? UserRatingCount { get; set; }

    public List<PhotosField> Photos { get; set; } = new List<PhotosField>();
}