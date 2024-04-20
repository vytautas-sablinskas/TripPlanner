using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TripPlanner.API.Database.Roles;
using TripPlanner.API.Dtos.TripPlaceRecommendations;
using TripPlanner.API.Services.TripPLaceRecommendations;

namespace TripPlanner.API.Controllers;

[Route("api/v1/")]
[ApiController]
public class TripPlaceRecommendationController : ControllerBase
{
    private readonly ITripPlaceRecommendationService _tripPlaceRecommendationService;

    public TripPlaceRecommendationController(ITripPlaceRecommendationService tripPlaceRecommendationService)
    {
        _tripPlaceRecommendationService = tripPlaceRecommendationService;
    }

    [HttpPost("recommendations")]
    public async Task<IActionResult> GetTripPlaceRecommendations([FromBody] TripPlaceRecommendationRequestDto dto)
    {
        var recommendations = await _tripPlaceRecommendationService.GetRecommendations(dto);
        return Ok(recommendations);
    }

    [HttpGet("recommendations/weights")]
    [Authorize(Roles = UserRoles.Admin)]
    public async Task<IActionResult> GetRecommendationWeights()
    {
        var recommendations = await _tripPlaceRecommendationService.GetRecommendationWeights();

        return Ok(recommendations);
    }

    [HttpPut("recommendations/weights")]
    [Authorize(Roles = UserRoles.Admin)]
    public async Task<IActionResult> EditRecommendationWeights([FromBody] EditTripRecommendationDto dto)
    {
        await _tripPlaceRecommendationService.EditRecommendationWeights(dto);

        return NoContent();
    }
}