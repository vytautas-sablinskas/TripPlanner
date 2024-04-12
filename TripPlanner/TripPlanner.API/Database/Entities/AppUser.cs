using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace TripPlanner.API.Database.Entities;

public class AppUser : IdentityUser
{
    public string Name { get; set; }
    
    public string Surname { get; set; }

    public string PhotoUri { get; set; }

    public virtual ICollection<RefreshToken> RefreshTokens { get; set; }
}