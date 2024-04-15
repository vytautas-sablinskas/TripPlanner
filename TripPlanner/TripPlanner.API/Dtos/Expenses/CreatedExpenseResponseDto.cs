namespace TripPlanner.API.Dtos.Expenses;

public record CreatedExpenseResponseDto (
  double Amount,
  double AmountInMainCurrency,
  Guid Id,
  string PersonPhoto,
  string PersonName
);