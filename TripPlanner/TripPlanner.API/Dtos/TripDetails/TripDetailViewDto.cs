using TripPlanner.API.Dtos.TripDocuments;

namespace TripPlanner.API.Dtos.TripDetails;

public record TripDetailViewDto (
  IEnumerable<TripDocumentDto> Documents
);