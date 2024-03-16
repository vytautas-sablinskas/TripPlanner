using System.ComponentModel.DataAnnotations;
using TripPlanner.API.Annotations.Trips;

namespace TripPlanner.API.Dtos.Trips;

public record EditTripDto(
    [Required]
    string Title,

    string Description,

    string DestinationCountry,

    IFormFile? Image,

    [Required]
    [DataType(DataType.DateTime)]
    DateTime StartDate,

    [Required]
    [DataType(DataType.DateTime)]
    [EndDateMustBeGreaterThanStartDate]
    DateTime EndDate
);