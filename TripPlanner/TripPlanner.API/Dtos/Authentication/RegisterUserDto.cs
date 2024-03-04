using System.ComponentModel.DataAnnotations;

namespace TripPlanner.API.Dtos.Authentication;

public record RegisterUserDto
(
    [Required]
    string FirstName,

    [Required]
    string LastName,

    [EmailAddress]
    [Required]
    string Email,

    [Required]
    string Password
);