using TripPlanner.API.Database.Enums;

namespace TripPlanner.API.Dtos.Expenses;

public record ExpenseDto(
    Guid Id,
    string Currency,
    double Amount,
    double AmountInMainCurrency,
    string Name,
    TripDetailTypes Type,
    string PersonPhoto,
    string PersonName,
    DateTime? Date
);