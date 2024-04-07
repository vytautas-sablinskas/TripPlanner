namespace TripPlanner.API.Dtos.TripDocuments;

public record TripDocumentDto(
  string Name,
  string LinkToFile,
  Guid Id
);