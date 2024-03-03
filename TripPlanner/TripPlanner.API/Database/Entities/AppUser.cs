using Microsoft.AspNetCore.Identity;

namespace TripPlanner.API.Database.Entities;

public class AppUser : IdentityUser
{
    public virtual ICollection<RefreshToken> RefreshTokens { get; set; }
}