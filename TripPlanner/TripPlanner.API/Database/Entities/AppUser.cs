using Microsoft.AspNetCore.Identity;

namespace TripPlanner.API.Database.Entities;

public class AppUser : IdentityUser
{
    public string FirstName { get; set; }

    public string LastName { get; set; }

    public virtual ICollection<RefreshToken> RefreshTokens { get; set; }
}