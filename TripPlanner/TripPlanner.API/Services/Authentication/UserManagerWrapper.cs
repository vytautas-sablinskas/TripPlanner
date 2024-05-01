using Microsoft.AspNetCore.Identity;
using TripPlanner.API.Database.Entities;

namespace TripPlanner.API.Services.Authentication;

public class UserManagerWrapper : IUserManagerWrapper
{
    private readonly UserManager<AppUser> _userManager;

    public UserManagerWrapper(UserManager<AppUser> userManager)
    {
        _userManager = userManager;
    }

    public async Task<AppUser?> FindByEmailAsync(string email)
    {
        return await _userManager.FindByEmailAsync(email);
    }

    public async Task<bool> CheckPasswordAsync(AppUser user, string password)
    {
        return await _userManager.CheckPasswordAsync(user, password);
    }

    public async Task<IList<string>> GetRolesAsync(AppUser user)
    {
        return await _userManager.GetRolesAsync(user);
    }

    public async Task<IdentityResult> CreateAsync(AppUser user, string password)
    {
        return await _userManager.CreateAsync(user, password);
    }

    public async Task<IdentityResult> AddToRoleAsync(AppUser user, string role)
    {
        return await _userManager.AddToRoleAsync(user, role);
    }

    public async Task<AppUser?> FindByIdAsync(string userId)
    {
        return await _userManager.FindByIdAsync(userId);
    }
}