using Microsoft.AspNetCore.Identity;
using TripPlanner.API.Database.Entities;
using TripPlanner.API.Database.Roles;

namespace TripPlanner.API.Database.Seeders;

public class AuthenticationSeeder : IAuthenticationSeeder
{
    private readonly UserManager<AppUser> _userManager;
    private readonly RoleManager<IdentityRole> _roleManager;

    public AuthenticationSeeder(UserManager<AppUser> userManager, RoleManager<IdentityRole> roleManager)
    {
        _userManager = userManager;
        _roleManager = roleManager;
    }

    public async Task SeedAsync()
    {
        await AddDefaultRoles();
        await AddAdminRoles();
    }

    private async Task AddAdminRoles()
    {
        var newAdminUser = new AppUser()
        {
            UserName = "admin",
            Email = "admin@admin.com"
        };

        var adminUserExists = await _userManager.FindByNameAsync(newAdminUser.UserName);
        if (adminUserExists != null)
            return;

        var createAdminUserResult = await _userManager.CreateAsync(newAdminUser, "Password1!");
        if (createAdminUserResult.Succeeded)
        {
            await _userManager.AddToRolesAsync(newAdminUser, UserRoles.All);
        }
    }

    private async Task AddDefaultRoles()
    {
        foreach (var role in UserRoles.All)
        {
            var roleExists = await _roleManager.RoleExistsAsync(role);
            if (!roleExists)
                await _roleManager.CreateAsync(new IdentityRole(role));
        }
    }
}