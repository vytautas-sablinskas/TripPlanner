using System.ComponentModel.DataAnnotations;

namespace TripPlanner.API.Database.Entities;

public class CurrencyExchangeRate
{
    [Key]
    public Guid Id { get; set; }

    public DateTime Date { get; set; }

    public string FromCurrency { get; set; }

    public string ToCurrency { get; set; }

    public double Rate { get; set; }
}