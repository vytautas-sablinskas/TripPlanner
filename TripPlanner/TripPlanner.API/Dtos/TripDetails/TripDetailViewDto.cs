using TripPlanner.API.Dtos.TripDocuments;

namespace TripPlanner.API.Dtos.TripDetails;

public record TripDetailViewDto (
  string Name,
  string? Address,
  string? PhoneNumber,
  string? Website,
  string? Notes,
  IEnumerable<TripDocumentDto> Documents
);