namespace TripPlanner.API.Dtos.TripDocuments;

public record EditDocumentDto (
  string Name,
  bool IsPrivate,
  IEnumerable<string> MemberIds
);