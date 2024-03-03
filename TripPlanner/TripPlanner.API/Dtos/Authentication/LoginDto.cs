using System.ComponentModel.DataAnnotations;

namespace TripPlanner.API.Dtos.Authentication;

public record LoginDto
(
    [Required]
    string UserName,

    [Required]
    string Password
);