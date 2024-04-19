namespace TripPlanner.API.Dtos.TripPlaceRecommendations;

public record EditTripRecommendationDto(
    IEnumerable<RecommendationWeightDto> RecommendationWeights
);