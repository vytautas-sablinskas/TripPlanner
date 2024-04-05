using TripPlanner.API.Database.Enums;
using TripPlanner.API.Dtos.TripTravellers;

namespace TripPlanner.API.Dtos.TripBudgets;

public class EditBudgetCurrentInfoDto
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public BudgetTypes Type { get; set; }
    public double Amount { get; set; }
    public double SpentAmount { get; set; }
    public bool UnlimitedBudget { get; set; }
    public string MainCurrency { get; set; }
    public IEnumerable<TripTravellerMinimalDto> TripTravellers { get; set; }
    public IEnumerable<TripBudgetMemberDto> BudgetMembers { get; set; }
}