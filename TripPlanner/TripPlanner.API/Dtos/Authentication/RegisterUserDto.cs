using System.ComponentModel.DataAnnotations;

namespace TripPlanner.API.Dtos.Authentication;

public record RegisterUserDto
(
    [Required]
    string UserName,

    [EmailAddress]
    [Required]
    string Email,

    [Required]
    string Password
);