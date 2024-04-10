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

    [HttpPost("budgets/{budgetId}/expense")]
    [Authorize]
    public async Task<IActionResult> AddExpense(Guid budgetId, AddExpenseDto dto)
    {
        await _expenseService.AddExpense(budgetId, User.GetUserId(), dto);

        return Ok();
    }
}