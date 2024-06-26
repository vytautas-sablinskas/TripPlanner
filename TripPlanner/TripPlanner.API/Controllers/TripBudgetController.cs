﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TripPlanner.API.Dtos.TripBudgets;
using TripPlanner.API.Extensions;
using TripPlanner.API.Services.TripBudgets;

namespace TripPlanner.API.Controllers;

[Route("api/v1/")]
[ApiController]
public class TripBudgetController : ControllerBase
{
    private readonly ITripBudgetsService _tripBudgetsService;

    public TripBudgetController(ITripBudgetsService tripBudgetsService)
    {
        _tripBudgetsService = tripBudgetsService;
    }

    [HttpGet("trips/{tripId}/budgets/travellerInfo")]
    [Authorize]
    public IActionResult GetAllTripTravellers(Guid tripId)
    {
        var travellers = _tripBudgetsService.GetTripTravellers(tripId);

        return Ok(travellers);
    }

    [HttpGet("trips/{tripId}/budgets/{budgetId}/info")]
    [Authorize]
    public async Task<IActionResult> GetTripBudgetInfo(Guid tripId, Guid budgetId)
    {
        var budgetInfo = await _tripBudgetsService.GetEditBudgetCurrentInfo(tripId, budgetId);

        return Ok(budgetInfo);
    }

    [HttpGet("trips/{tripId}/budgets")]
    [Authorize]
    public async Task<IActionResult> GetAllBudgets(Guid tripId)
    {
        var budgets = await _tripBudgetsService.GetTripBudgets(tripId, User.GetUserId());

        return Ok(budgets);
    }

    [HttpGet("trips/{tripId}/budgets/{budgetId}")]
    [Authorize]
    public async Task<IActionResult> GetBudgetById(Guid budgetId)
    {
        var budget = await _tripBudgetsService.GetTripBudgetById(budgetId, User.GetUserId());

        return Ok(budget);
    }

    [HttpPost("trips/{tripId}/budgets")]
    [Authorize]
    public async Task<IActionResult> CreateBudget(Guid tripId, AddTripBudgetDto dto)
    {
        await _tripBudgetsService.AddTripBudget(tripId, User.GetUserId(), dto);

        return Ok();
    }

    [HttpPut("trips/{tripId}/budgets/{budgetId}")]
    [Authorize]
    public async Task<IActionResult> EditBudget(Guid budgetId, EditBudgetDto dto)
    {
        await _tripBudgetsService.EditTripBudget(budgetId, dto);

        return Ok();
    }

    [HttpDelete("trips/{tripId}/budgets/{budgetId}")]
    [Authorize]
    public async Task<IActionResult> DeleteBudget(Guid budgetId)
    {
        await _tripBudgetsService.DeleteTripBudget(budgetId);

        return NoContent();
    }
}