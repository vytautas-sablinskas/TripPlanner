using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using TripPlanner.API.Database.Enums;

namespace TripPlanner.API.Database.Entities;

public class TripBudget
{
    [Key]
    public Guid Id { get; set; }

    public string Name { get; set; }

    public string? Description { get; set; }

    public BudgetTypes Type { get; set; }

    public bool? UnlimitedBudget { get; set; }

    public double Budget { get; set; }

    public string MainCurrency { get; set; }

    public double SpentAmount { get; set; }

    [DeleteBehavior(DeleteBehavior.Cascade)]
    public virtual ICollection<Expense>? Expenses { get; set; }

    [DeleteBehavior(DeleteBehavior.Cascade)]
    public virtual ICollection<TripBudgetMember>? BudgetMembers { get; set; }

    [DeleteBehavior(DeleteBehavior.Restrict)]
    public virtual AppUser Creator { get; set; }

    public string CreatorId { get; set; } 

    public virtual Trip Trip { get; set; }

    public Guid TripId { get; set; }
}