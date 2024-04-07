using Microsoft.AspNetCore.Mvc;
using TripPlanner.API.Dtos.TripDocuments;
using TripPlanner.API.Extensions;
using TripPlanner.API.Services.TripDocuments;

namespace TripPlanner.API.Controllers;

[Route("api/v1/")]
[ApiController]
public class TripDocumentController : ControllerBase
{
    private readonly ITripDocumentService _tripDocumentService;

    public TripDocumentController(ITripDocumentService tripDocumentService)
    {
        _tripDocumentService = tripDocumentService;
    }

    [HttpPost("trips/{tripId}/tripDetails/{tripDetailId}/documents")]
    public async Task<IActionResult> AddDocument(Guid tripDetailId, [FromForm] AddNewTripDocumentDto dto)
    {
        var (isSuccess, successDto) = await _tripDocumentService.AddNewDocument(User.GetUserId(), tripDetailId, dto);
        if (!isSuccess)
        {
            return BadRequest();
        }

        return Ok(successDto);
    }
}