using Microsoft.EntityFrameworkCore;
using System.Net.Http;
using TripPlanner.API.Database.DataAccess;
using TripPlanner.API.Database.Entities;

namespace TripPlanner.API.Services.CurrencyExchangeService;

public class CurrencyExchangeService : ICurrencyExchangeService
{
    private readonly IRepository<CurrencyExchangeRate> _currencyExchangeRateRepository;
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _configuration;

    public CurrencyExchangeService(IRepository<CurrencyExchangeRate> currencyExchangeRateRepository, HttpClient httpClient, IConfiguration configuration)
    {
        _currencyExchangeRateRepository = currencyExchangeRateRepository;
        _httpClient = httpClient;
        _configuration = configuration;
    }

    public async Task<double> GetCurrencyInformation(DateTime date, string mainCurrency, string currencyToGet)
    {
        var exchangeRate = await _currencyExchangeRateRepository.FindByCondition(c => c.FromCurrency == currencyToGet &&
                                                        c.ToCurrency == mainCurrency &&
                                                        c.Date.Date == date.Date
        ).FirstOrDefaultAsync();

        if (exchangeRate == null)
        {
            return await AddAndGetCurrencyExchangeRate(date, mainCurrency, currencyToGet);
        }

        return exchangeRate.Rate;
    }

    private async Task<double> AddAndGetCurrencyExchangeRate(DateTime date, string mainCurrency, string toCurrency)
    {
        var rate = await FetchOpenExchangeAPIAndGetRate(date, mainCurrency, toCurrency);

        return rate;
    }

    private async Task<double> FetchOpenExchangeAPIAndGetRate(DateTime date, string mainCurrency, string toCurrency)
    {
        double toCurrencyRate = 0;
        var API_KEY = _configuration["OpenExchangeAPI:Key"];

        var link = $"https://v6.exchangerate-api.com/v6/{API_KEY}/latest/{mainCurrency}";
        HttpResponseMessage response = await _httpClient.GetAsync(link);

        if (response.IsSuccessStatusCode)
        {
            var jsonResponse = await response.Content.ReadAsStringAsync();

            dynamic jsonResponseObject = Newtonsoft.Json.JsonConvert.DeserializeObject(jsonResponse);
            var conversionRates = jsonResponseObject.conversion_rates;

            foreach (var rate in conversionRates)
            {
                var currencyName = (string)rate.Name;
                var currencyValue = (double)rate.Value;
                if (toCurrency == currencyName)
                {
                    toCurrencyRate = (1 / currencyValue);
                }

                _currencyExchangeRateRepository.Create(new CurrencyExchangeRate
                {
                    FromCurrency = (string)rate.Name,
                    ToCurrency = mainCurrency,
                    Rate = (1 / currencyValue),
                    Date = date.Date,
                });
            }

            return toCurrencyRate;
        }
        else
        {
            throw new HttpRequestException($"Failed to fetch fake API data. Status code: {response.StatusCode}");
        }
    }
}