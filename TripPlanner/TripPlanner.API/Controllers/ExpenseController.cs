using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TripPlanner.API.Dtos.Expenses;
using TripPlanner.API.Extensions;
using TripPlanner.API.Services.Expenses;

namespace TripPlanner.API.Controllers;

[Route("api/v1/")]
[ApiController]
public class ExpenseController : ControllerBase
{
    private readonly IExpenseService _expenseService;

    public ExpenseController(IExpenseService expenseService)
    {
        _expenseService = expenseService;
    }

    [HttpPost("trips/{tripId}/budgets/{budgetId}/expenses")]
    [Authorize]
    public async Task<IActionResult> AddExpense(Guid budgetId, AddExpenseDto dto)
    {
        var expense = await _expenseService.AddExpense(budgetId, User.GetUserId(), dto);

        if (expense == null)
        {
            return BadRequest();
        }

        return Ok(expense);
    }

    [HttpDelete("trips/{tripId}/budgets/{budgetId}/expenses/{expenseId}")]
    [Authorize]
    public async Task<IActionResult> DeleteExpense(Guid expenseId)
    {
        var response = await _expenseService.DeleteExpense(expenseId);

        if (response == null)
        {
            return BadRequest();
        }

        return Ok(response);
    }
}