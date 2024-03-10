using System.ComponentModel.DataAnnotations;

namespace TripPlanner.API.Dtos.Authentication;

public record RegisterUserDto
(
    [Required]
    string Name,

    [Required]
    string Surname,

    [EmailAddress]
    [Required]
    string Email,

    [Required]
    string Password
);