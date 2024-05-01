using Microsoft.Extensions.Configuration;
using Moq;
using System.Net;
using System.Text;
using TripPlanner.API.Database.DataAccess;
using TripPlanner.API.Database.Entities;
using TripPlanner.API.Services.CurrencyExchangeService;
using TripPlanner.API.Wrappers;

namespace TripPlanner.API.UnitTests.Services.CurrencyExchange;

public class CurrencyExchangeServiceTests
{
    private readonly Mock<IRepository<CurrencyExchangeRate>> _currencyExchangeRateRepositoryMock;
    private readonly Mock<IHttpClientWrapper> _httpClientMock;
    private readonly Mock<IConfiguration> _configurationMock;
    private readonly CurrencyExchangeService _service;

    public CurrencyExchangeServiceTests()
    {
        _currencyExchangeRateRepositoryMock = new Mock<IRepository<CurrencyExchangeRate>>();
        _httpClientMock = new Mock<IHttpClientWrapper>();
        _configurationMock = new Mock<IConfiguration>();
        _service = new CurrencyExchangeService(_currencyExchangeRateRepositoryMock.Object, _httpClientMock.Object, _configurationMock.Object);
    }

    [Fact]
    public async Task GetCurrencyInformation_GivenValidFromAndToCurrency_ShouldReturnCorrectExchangeRate()
    {
        string jsonResponse = "{\"conversion_rates\":{\"USD\":1.23,\"EUR\":0.89}}";

        HttpResponseMessage response = new HttpResponseMessage(HttpStatusCode.OK)
        {
            Content = new StringContent(jsonResponse, Encoding.UTF8, "application/json")
        };

        _httpClientMock.Setup(v => v.GetAsync(It.IsAny<string>()))
            .ReturnsAsync(response);

        var exchangeRate = await _service.GetCurrencyInformation(DateTime.UtcNow, "USD", "EUR");

        Assert.True(Math.Round(exchangeRate, 3) == Math.Round(1 / 0.89, 3));
    }
}