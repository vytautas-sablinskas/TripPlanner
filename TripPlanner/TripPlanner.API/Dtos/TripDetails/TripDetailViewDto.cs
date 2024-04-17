using TripPlanner.API.Dtos.TripDocuments;
using TripPlanner.API.Dtos.TripTravellers;
using TripPlanner.API.Services.TripTravellers;

namespace TripPlanner.API.Dtos.TripDetails;

public record TripDetailViewDto (
  string Name,
  string? Address,
  string? PhoneNumber,
  string? Website,
  string? Notes,
  int ActiveDocuments,
  TripPermissions Permissions,
  DateTime? StartTime,
  DateTime? EndTime,
  IEnumerable<TripDocumentDto> Documents,
  IEnumerable<TripTravellerMinimalDto> Travellers
);