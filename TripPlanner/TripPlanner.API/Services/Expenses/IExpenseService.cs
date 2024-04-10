using TripPlanner.API.Dtos.Expenses;

namespace TripPlanner.API.Services.Expenses
{
    public interface IExpenseService
    {
        Task AddExpense(Guid budgetId, string userId, AddExpenseDto dto);
    }
}