using TripPlanner.API.Dtos.TripDocuments;
using TripPlanner.API.Dtos.TripTravellers;

namespace TripPlanner.API.Dtos.TripDetails;

public record TripDetailViewDto (
  string Name,
  string? Address,
  string? PhoneNumber,
  string? Website,
  string? Notes,
  int ActiveDocuments,
  DateTime? StartTime,
  DateTime? EndTime,
  IEnumerable<TripDocumentDto> Documents,
  IEnumerable<TripTravellerMinimalDto> Travellers
);