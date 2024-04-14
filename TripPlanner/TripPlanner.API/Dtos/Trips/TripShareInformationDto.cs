namespace TripPlanner.API.Dtos.Trips;

public record TripShareInformationDto (
  string Title,
  string DescriptionInHtml,
  IEnumerable<string> Photos,
  string? Link
);