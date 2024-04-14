using TripPlanner.API.Services.TripPlaceRecommendations;

namespace TripPlanner.API.Dtos.TripPlaceRecommendations;

public record TripPlaceRecommendationRequestDto(
    double Radius,
    double Longitude,
    double Latitude,
    double RatingWeight,
    double RatingCountWeight,
    double DistanceWeight,
    IEnumerable<RecommendationCategories> Categories,
    GooglePriceLevel PriceLevel
);