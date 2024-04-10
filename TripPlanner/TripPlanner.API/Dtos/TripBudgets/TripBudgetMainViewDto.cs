using TripPlanner.API.Dtos.Expenses;

namespace TripPlanner.API.Dtos.TripBudgets;

public record TripBudgetMainViewDto (
    Guid Id,
    string Currency,
    double SpentAmount,
    double BudgetAmount,
    IEnumerable<ExpenseDto> Expenses
);