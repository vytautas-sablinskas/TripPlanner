using Microsoft.EntityFrameworkCore;
using TripPlanner.API.Database.Enums;

namespace TripPlanner.API.Database.Entities;

public class Expense
{
    public Guid Id { get; set; }

    public string Name { get; set; } 

    public TripDetailTypes Type { get; set; }

    public double Amount { get; set; }

    public string Currency { get; set; }

    public DateTime? Date { get; set; }

    public double AmountInMainCurrency { get; set; }

    [DeleteBehavior(DeleteBehavior.Restrict)]
    public virtual TripBudget TripBudget { get; set; }

    public Guid TripBudgetId { get; set; }

    [DeleteBehavior(DeleteBehavior.Restrict)]
    public virtual AppUser User { get; set; }
    
    public string UserId { get; set; }
}