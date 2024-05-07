using TripPlanner.API.Database.Enums;

namespace TripPlanner.API.Dtos.Expenses;

public record AddExpenseDto (
    string Currency,
    TripDetailTypes Type,
    string Name,
    double Amount,
    DateTime? Date
);