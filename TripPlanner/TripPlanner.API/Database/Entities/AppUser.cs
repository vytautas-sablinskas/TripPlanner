using Microsoft.AspNetCore.Identity;

namespace TripPlanner.API.Database.Entities;

public class AppUser : IdentityUser
{
    public string Name { get; set; }
    
    public string Surname { get; set; }

    public virtual ICollection<RefreshToken> RefreshTokens { get; set; }
}