using TripPlanner.API.Dtos.TripPlaceRecommendations;
using TripPlanner.API.Services.TripPlaceRecommendations;

namespace TripPlanner.API.Services.TripPLaceRecommendations;

public interface ITripPlaceRecommendationService
{
    Task<IEnumerable<CategoryRecommendation>> GetRecommendations(TripPlaceRecommendationRequestDto dto);

    Task<IEnumerable<RecommendationWeightDto>> GetRecommendationWeights();

    Task EditRecommendationWeights(EditTripRecommendationDto dto);
}