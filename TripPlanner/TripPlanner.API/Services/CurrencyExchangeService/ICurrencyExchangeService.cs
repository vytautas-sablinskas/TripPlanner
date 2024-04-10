namespace TripPlanner.API.Services.CurrencyExchangeService;

public interface ICurrencyExchangeService
{
    Task<double> GetCurrencyInformation(DateTime date, string mainCurrency, string currencyToGet);
}