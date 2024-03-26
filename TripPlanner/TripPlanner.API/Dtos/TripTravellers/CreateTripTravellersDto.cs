using System.ComponentModel.DataAnnotations;

namespace TripPlanner.API.Dtos.TripTravellers;

public record CreateTripTravellersDto (
    [MinLength(1, ErrorMessage = "At least one traveller is required.")]
    IEnumerable<string> TravellerEmails
);