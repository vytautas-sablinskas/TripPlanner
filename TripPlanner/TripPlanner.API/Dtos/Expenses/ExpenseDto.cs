using TripPlanner.API.Database.Enums;

namespace TripPlanner.API.Dtos.Expenses;

public record ExpenseDto(
    Guid Id,
    string Currency,
    double Amount,
    string Name,
    BudgetTypes Type,
    string PersonPhoto,
    string PersonName
);