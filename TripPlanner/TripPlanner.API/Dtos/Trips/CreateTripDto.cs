using System.ComponentModel.DataAnnotations;
using TripPlanner.API.Annotations.Trips;

namespace TripPlanner.API.Dtos.Trips;

public record CreateTripDto (
    [Required]
    string Title,

    string Description,

    string DestinationCountry,

    [Required]
    string PhotoUri,

    [Required]
    [DataType(DataType.DateTime)]
    DateTime StartDate,

    [Required]
    [DataType(DataType.DateTime)]
    [EndDateMustBeGreaterThanStartDate]
    DateTime EndDate
);