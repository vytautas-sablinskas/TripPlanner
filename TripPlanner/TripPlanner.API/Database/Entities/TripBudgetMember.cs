using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace TripPlanner.API.Database.Entities;

public class TripBudgetMember
{
    [Key]
    public Guid Id { get; set; }

    [DeleteBehavior(DeleteBehavior.Restrict)]
    public TripBudget TripBudget { get; set; }

    public Guid TripBudgetId { get; set; }

    [DeleteBehavior(DeleteBehavior.Restrict)]
    public AppUser User { get; set; }

    public string UserId { get; set; }

    public double Amount { get; set; }
}