using Microsoft.AspNetCore.Identity;
using TripPlanner.API.Database.Entities;

namespace TripPlanner.API.Wrappers;

public interface IUserManagerWrapper
{
    Task<AppUser?> FindByEmailAsync(string email);

    Task<bool> CheckPasswordAsync(AppUser user, string password);

    Task<IList<string>> GetRolesAsync(AppUser user);

    Task<IdentityResult> CreateAsync(AppUser user, string password);

    Task<IdentityResult> AddToRoleAsync(AppUser user, string role);

    Task<AppUser?> FindByIdAsync(string userId);

    Task<IdentityResult> ChangePasswordAsync(AppUser user, string currentPassword, string newPassword);

    Task<IdentityResult> UpdateAsync(AppUser user);
}