namespace TripPlanner.API.Dtos.Expenses;

public record EditExpenseResponseDto (
    double Amount,
    double AmountInMainCurrency
);