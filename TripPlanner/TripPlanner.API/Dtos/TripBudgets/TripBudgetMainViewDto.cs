using TripPlanner.API.Dtos.Expenses;

namespace TripPlanner.API.Dtos.TripBudgets;

public record TripBudgetMainViewDto (
    Guid Id,
    string Currency,
    bool UnlimitedBudget,
    double SpentAmount,
    double BudgetAmount,
    IEnumerable<ExpenseDto> Expenses
);