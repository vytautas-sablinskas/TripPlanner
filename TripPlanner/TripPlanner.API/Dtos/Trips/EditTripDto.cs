using System.ComponentModel.DataAnnotations;
using TripPlanner.API.Annotations;

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
    [EndDateValidationEditTrip]
    DateTime EndDate
);