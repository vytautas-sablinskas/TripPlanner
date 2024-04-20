using TripPlanner.API.Services.TripPlaceRecommendations;

namespace TripPlanner.API.Dtos.TripPlaceRecommendations;

public record TripPlaceRecommendationRequestDto(
    double Radius,
    double Longitude,
    double Latitude,
    string RatingWeight,
    string RatingCountWeight,
    string DistanceWeight,
    IEnumerable<RecommendationCategories> Categories,
    GooglePriceLevel PriceLevel
);