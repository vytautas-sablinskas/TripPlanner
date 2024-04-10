using TripPlanner.API.Dtos.Expenses;

namespace TripPlanner.API.Services.Expenses;

public interface IExpenseService
{
    Task<CreatedExpenseResponseDto> AddExpense(Guid budgetId, string userId, AddExpenseDto dto);

    Task<DeleteExpenseResponseDto> DeleteExpense(Guid expenseId);
}