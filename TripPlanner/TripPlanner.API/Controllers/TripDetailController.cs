using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TripPlanner.API.Dtos.TripDetails;
using TripPlanner.API.Extensions;
using TripPlanner.API.Services.TripDetails;

namespace TripPlanner.API.Controllers;

[Route("api/v1/")]
[ApiController]
public class TripDetailController : ControllerBase
{
    private readonly ITripDetailsService _tripDetailsService;

    public TripDetailController(ITripDetailsService tripDetailsService)
    {
        _tripDetailsService = tripDetailsService;
    }

    [HttpGet("trips/{tripId}/tripDetails")]
    [Authorize]
    public async Task<IActionResult> GetTripDetails(Guid tripId)
    {
        var details = await _tripDetailsService.GetTripDetails(tripId);

        return Ok(details);
    }

    [HttpGet("trips/{tripId}/tripDetails/{detailId}")]
    [Authorize]
    public IActionResult GetTripDetailById(Guid tripId, Guid detailId)
    {
        var detailById = _tripDetailsService.GetTripDetailById(tripId, detailId);

        return Ok(detailById);
    }

    [HttpGet("trips/{tripId}/tripDetails/{detailId}/view")]
    [Authorize]
    public async Task<IActionResult> GetTripDetailForView(Guid detailId)
    {
        var (isSuccess, dto) = await _tripDetailsService.GetTripDetailView(detailId);
        if (!isSuccess)
        {
            return BadRequest();
        }

        return Ok(dto);
    }

    [HttpPost("tripDetails")]
    [Authorize]
    public IActionResult CreateTripDetail([FromBody] CreateTripDetailDto dto)
    {
        _tripDetailsService.CreateTripDetail(dto, User.GetUserId());

        return Ok();
    }

    [HttpPut("tripDetails")]
    public async Task<IActionResult> UpdateTripDetail([FromBody] EditTripDetailDto detailDto) 
    {
        await _tripDetailsService.EditTripDetail(detailDto);

        return Ok();
    }

    [HttpDelete("tripDetails/{id}")]
    [Authorize]
    public async Task<IActionResult> DeleteTripDetail(Guid id)
    {
        await _tripDetailsService.DeleteTripDetail(id);

        return NoContent();
    }
}