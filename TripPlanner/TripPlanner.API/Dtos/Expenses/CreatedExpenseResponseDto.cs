namespace TripPlanner.API.Dtos.Expenses;

public record CreatedExpenseResponseDto (
  double Amount,
  Guid Id,
  string PersonPhoto,
  string PersonName
);