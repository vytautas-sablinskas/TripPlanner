using Moq;
using System.Linq.Expressions;
using TripPlanner.API.Database.DataAccess;
using TripPlanner.API.Database.Entities;
using TripPlanner.API.Dtos.Expenses;
using TripPlanner.API.Services.CurrencyExchangeService;
using TripPlanner.API.Services.Expenses;

namespace TripPlanner.API.UnitTests.Services.Expenses;

public class ExpenseServiceTests
{
    private readonly Mock<IRepository<TripBudget>> _tripBudgetRepositoryMock;
    private readonly Mock<IRepository<Expense>> _expenseRepositoryMock;
    private readonly Mock<ICurrencyExchangeService> _currencyExchangeServiceMock;
    private readonly Mock<IRepository<AppUser>> _appUserRepositoryMock;
    private readonly ExpenseService _service;

    public ExpenseServiceTests()
    {
        _tripBudgetRepositoryMock = new Mock<IRepository<TripBudget>>();
        _expenseRepositoryMock = new Mock<IRepository<Expense>>();
        _currencyExchangeServiceMock = new Mock<ICurrencyExchangeService>();
        _appUserRepositoryMock = new Mock<IRepository<AppUser>>();
        _service = new ExpenseService(_expenseRepositoryMock.Object, _tripBudgetRepositoryMock.Object, _currencyExchangeServiceMock.Object, _appUserRepositoryMock.Object);
    }

    [Fact]
    public async Task AddExpense_BudgetNotFound_ReturnsNull()
    {
        var budgetId = Guid.NewGuid();
        var userId = "user1";
        _tripBudgetRepositoryMock.Setup(repo => repo.GetFirstOrDefaultAsync(It.IsAny<Expression<Func<TripBudget, bool>>>()))
            .ReturnsAsync((TripBudget)null);

        var result = await _service.AddExpense(budgetId, userId, new AddExpenseDto("", Database.Enums.TripDetailTypes.Activity, "", 1, DateTime.UtcNow));

        Assert.Null(result);
    }

    [Fact]
    public async Task AddExpense_SuccessfullyAddsExpense()
    {
        var budgetId = Guid.NewGuid();
        var userId = "user1";
        var dto = new AddExpenseDto("USD", Database.Enums.TripDetailTypes.Activity, "Expense 1", 100, DateTime.UtcNow);
        var budget = new TripBudget { Id = budgetId, SpentAmount = 500, MainCurrency = "EUR" };
        var rate = 1.2;
        var user = new AppUser { Id = userId, Name = "John", Surname = "Doe", PhotoUri = "photo.jpg" };
        _tripBudgetRepositoryMock.Setup(repo => repo.GetFirstOrDefaultAsync(It.IsAny<Expression<Func<TripBudget, bool>>>()))
            .ReturnsAsync(budget);
        _currencyExchangeServiceMock.Setup(service => service.GetCurrencyInformation(It.IsAny<DateTime>(), It.IsAny<string>(), It.IsAny<string>()))
            .ReturnsAsync(rate);
        _appUserRepositoryMock.Setup(repo => repo.GetFirstOrDefaultAsync(It.IsAny<Expression<Func<AppUser, bool>>>()))
            .ReturnsAsync(user);
        _expenseRepositoryMock.Setup(repo => repo.Create(It.IsAny<Expense>()))
            .Returns(new Expense { Id = Guid.NewGuid() });

        var result = await _service.AddExpense(budgetId, userId, dto);

        Assert.NotNull(result);
        Assert.Equal(620, result.Amount);
        Assert.Equal(120, result.AmountInMainCurrency);
        Assert.Equal(user.PhotoUri, result.PersonPhoto);
        Assert.Equal($"{user.Name} {user.Surname}", result.PersonName);
    }

    [Fact]
    public async Task DeleteExpense_ExpenseNotFound_ReturnsNull()
    {
        var expenseId = Guid.NewGuid();
        _expenseRepositoryMock.Setup(repo => repo.GetFirstOrDefaultAsync(It.IsAny<Expression<Func<Expense, bool>>>()))
            .ReturnsAsync((Expense)null);

        var result = await _service.DeleteExpense(expenseId);

        Assert.Null(result);
    }

    [Fact]
    public async Task DeleteExpense_BudgetNotFound_ReturnsNull()
    {
        var expenseId = Guid.NewGuid();
        var expense = new Expense { Id = expenseId, TripBudgetId = Guid.NewGuid(), AmountInMainCurrency = 50 };
        _expenseRepositoryMock.Setup(repo => repo.GetFirstOrDefaultAsync(It.IsAny<Expression<Func<Expense, bool>>>()))
            .ReturnsAsync(expense);
        _tripBudgetRepositoryMock.Setup(repo => repo.GetFirstOrDefaultAsync(It.IsAny<Expression<Func<TripBudget, bool>>>()))
            .ReturnsAsync((TripBudget)null);

        var result = await _service.DeleteExpense(expenseId);

        Assert.Null(result);
    }

    [Fact]
    public async Task DeleteExpense_SuccessfullyDeletesExpense()
    {
        var expenseId = Guid.NewGuid();
        var expense = new Expense { Id = expenseId, TripBudgetId = Guid.NewGuid(), AmountInMainCurrency = 50 };
        var budget = new TripBudget { Id = expense.TripBudgetId, SpentAmount = 100 };
        _expenseRepositoryMock.Setup(repo => repo.GetFirstOrDefaultAsync(It.IsAny<Expression<Func<Expense, bool>>>()))
            .ReturnsAsync(expense);
        _tripBudgetRepositoryMock.Setup(repo => repo.GetFirstOrDefaultAsync(It.IsAny<Expression<Func<TripBudget, bool>>>()))
            .ReturnsAsync(budget);

        var result = await _service.DeleteExpense(expenseId);

        Assert.NotNull(result);
        Assert.Equal(50, result.Amount);
    }


    [Fact]
    public async Task EditExpense_SuccessfullyEditsExpense()
    {
        var budgetId = Guid.NewGuid();
        var expenseId = Guid.NewGuid();
        var dto = new AddExpenseDto("USD", Database.Enums.TripDetailTypes.Activity, "Expense 1", 100, DateTime.UtcNow);
        var budget = new TripBudget { Id = budgetId, SpentAmount = 500, MainCurrency = "EUR" };
        var rate = 1.2;
        var currentExpense = new Expense { Id = expenseId, Amount = 50, Currency = "EUR", AmountInMainCurrency = 60 };
        _tripBudgetRepositoryMock.Setup(repo => repo.GetFirstOrDefaultAsync(It.IsAny<Expression<Func<TripBudget, bool>>>()))
            .ReturnsAsync(budget);
        _currencyExchangeServiceMock.Setup(service => service.GetCurrencyInformation(It.IsAny<DateTime>(), It.IsAny<string>(), It.IsAny<string>()))
            .ReturnsAsync(rate);
        _expenseRepositoryMock.Setup(repo => repo.GetFirstOrDefaultAsync(It.IsAny<Expression<Func<Expense, bool>>>()))
            .ReturnsAsync(currentExpense);


        var result = await _service.EditExpense(budgetId, expenseId, dto);

        Assert.NotNull(result);
        Assert.Equal(560, result.Amount);
        Assert.Equal(120, result.AmountInMainCurrency);
    }
}