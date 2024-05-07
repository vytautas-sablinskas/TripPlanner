using AutoMapper;
using Moq;
using System.Linq.Expressions;
using TripPlanner.API.Database.DataAccess;
using TripPlanner.API.Database.Entities;
using TripPlanner.API.Database.Enums;
using TripPlanner.API.Dtos.TripBudgets;
using TripPlanner.API.Services.CurrencyExchangeService;
using TripPlanner.API.Services.TripBudgets;

namespace TripPlanner.API.UnitTests.Services.TripBudgets;

public class TripBudgetServiceTests
{
    private readonly Mock<IRepository<Traveller>> _travellersRepositoryMock;
    private readonly Mock<IRepository<AppUser>> _appUserRepositoryMock;
    private readonly Mock<IRepository<TripBudget>> _tripBudgetRepositoryMock;
    private readonly Mock<IRepository<TripBudgetMember>> _tripBudgetMembersRepositoryMock;
    private readonly Mock<IRepository<Expense>> _expenseRepositoryMock;
    private readonly Mock<ICurrencyExchangeService> _currencyExchangeServiceMock;
    private readonly Mock<IMapper> _mapperMock;
    private readonly TripBudgetsService _service;

    public TripBudgetServiceTests()
    {
        _travellersRepositoryMock = new Mock<IRepository<Traveller>>();
        _appUserRepositoryMock = new Mock<IRepository<AppUser>>();
        _tripBudgetRepositoryMock = new Mock<IRepository<TripBudget>>();
        _tripBudgetMembersRepositoryMock = new Mock<IRepository<TripBudgetMember>>();
        _expenseRepositoryMock = new Mock<IRepository<Expense>>();
        _currencyExchangeServiceMock = new Mock<ICurrencyExchangeService>();
        _mapperMock = new Mock<IMapper>();

        _service = new TripBudgetsService(_travellersRepositoryMock.Object, _appUserRepositoryMock.Object, _tripBudgetRepositoryMock.Object, _tripBudgetMembersRepositoryMock.Object, _expenseRepositoryMock.Object, _currencyExchangeServiceMock.Object, _mapperMock.Object);
    }

    [Fact]
    public void GetTripTravellers_ReturnsTripTravellers()
    {
        var tripId = Guid.NewGuid();
        var travellers = new List<Traveller>
            {
                new Traveller { User = new AppUser { Id = "user1", Email = "user1@example.com", Name = "John", Surname = "Doe", PhotoUri = "photo1.jpg" }, TripId = tripId },
                new Traveller { User = new AppUser { Id = "user2", Email = "user2@example.com", Name = "Jane", Surname = "Doe", PhotoUri = "photo2.jpg" }, TripId = tripId }
            };

        _travellersRepositoryMock.Setup(repo => repo.FindByCondition(It.IsAny<Expression<Func<Traveller, bool>>>())).Returns(travellers.AsQueryable());

        var result = _service.GetTripTravellers(tripId);

        Assert.NotNull(result);
        Assert.Equal(2, result.Count());
        Assert.Collection(result,
            item =>
            {
                Assert.Equal("user1", item.Id);
                Assert.Equal("user1@example.com", item.Email);
                Assert.Equal("John Doe", item.FullName);
                Assert.Equal("photo1.jpg", item.Photo);
            },
            item =>
            {
                Assert.Equal("user2", item.Id);
                Assert.Equal("user2@example.com", item.Email);
                Assert.Equal("Jane Doe", item.FullName);
                Assert.Equal("photo2.jpg", item.Photo);
            });
    }

    [Fact]
    public async Task GetTripBudgetById_ReturnsTripBudgetMainViewDto()
    {
        var budgetId = Guid.NewGuid();
        var userId = "user1";
        var budget = new TripBudget
        {
            Id = budgetId,
            MainCurrency = "USD",
            UnlimitedBudget = false,
            SpentAmount = 100,
            Budget = 500,
            Type = BudgetTypes.IndividualWithFixedAmount,
            Expenses = new List<Expense>
                {
                    new Expense { Id = Guid.NewGuid(), Currency = "USD", Amount = 50, AmountInMainCurrency = 50, Name = "Expense 1", UserId = userId, Date = DateTime.UtcNow },
                    new Expense { Id = Guid.NewGuid(), Currency = "USD", Amount = 60, AmountInMainCurrency = 60, Name = "Expense 2", UserId = "user2", Date = DateTime.UtcNow }
                }
        };
        var user = new AppUser { Id = userId, Name = "John", Surname = "Doe", PhotoUri = "photo1.jpg" };
        _tripBudgetRepositoryMock.Setup(repo => repo.FindByCondition(It.IsAny<Expression<Func<TripBudget, bool>>>())).Returns(new List<TripBudget> { budget }.AsQueryable());
        _appUserRepositoryMock.Setup(repo => repo.FindByCondition(It.IsAny<Expression<Func<AppUser, bool>>>())).Returns(new List<AppUser> { user }.AsQueryable());
        _tripBudgetMembersRepositoryMock.Setup(repo => repo.GetFirstOrDefaultAsync(It.IsAny<Expression<Func<TripBudgetMember, bool>>>())).ReturnsAsync(new TripBudgetMember { Amount = 50 });

        var result = await _service.GetTripBudgetById(budgetId, userId);

        Assert.NotNull(result);
        Assert.Equal(budgetId, result.Id);
        Assert.Equal("USD", result.Currency);
        Assert.False(result.UnlimitedBudget);
        Assert.Equal(50, result.SpentAmount);
        Assert.Equal(50, result.BudgetAmount);
        Assert.Equal(1, result.Expenses.Count());
        var expenseDto = result.Expenses.First();
        Assert.Equal("Expense 1", expenseDto.Name);
        Assert.Equal("USD", expenseDto.Currency);
        Assert.Equal(50, expenseDto.Amount);
        Assert.Equal(50, expenseDto.AmountInMainCurrency);
    }

    [Fact]
    public async Task GetEditBudgetCurrentInfo_ReturnsEditBudgetCurrentInfoDto()
    {
        var tripId = Guid.NewGuid();
        var budgetId = Guid.NewGuid();
        var travellers = new List<Traveller>
            {
                new Traveller { User = new AppUser { Id = Guid.NewGuid().ToString(), Name = "John", Surname = "Doe", Email = "john@example.com", PhotoUri = "photo.jpg" } }
            }.AsQueryable();
        var budgetMembers = new List<TripBudgetMember>
            {
                new TripBudgetMember { User = new AppUser { Id = Guid.NewGuid().ToString(), Name = "Alice", Surname = "Smith", Email = "alice@example.com" }, Amount = 100 }
            };
        var budget = new TripBudget
        {
            Id = budgetId,
            Name = "Budget Name",
            Description = "Budget Description",
            MainCurrency = "USD",
            UnlimitedBudget = false,
            Type = BudgetTypes.IndividualWithFixedAmount,
            Budget = 500,
            BudgetMembers = budgetMembers
        };
        _travellersRepositoryMock.Setup(repo => repo.FindByCondition(It.IsAny<Expression<Func<Traveller, bool>>>())).Returns(travellers);
        _tripBudgetRepositoryMock.Setup(repo => repo.FindByCondition(It.IsAny<Expression<Func<TripBudget, bool>>>())).Returns(new List<TripBudget> { budget }.AsQueryable());

        var result = await _service.GetEditBudgetCurrentInfo(tripId, budgetId);

        Assert.NotNull(result);
        Assert.Equal("Budget Name", result.Name);
        Assert.Equal("Budget Description", result.Description);
        Assert.Equal("USD", result.MainCurrency);
        Assert.False(result.UnlimitedBudget);
        Assert.Equal(BudgetTypes.IndividualWithFixedAmount, result.Type);
        Assert.Equal(500, result.Amount);
        Assert.NotEmpty(result.BudgetMembers);
        Assert.Collection(result.BudgetMembers, member =>
        {
            Assert.Equal("alice@example.com", member.Email);
            Assert.Equal("Alice Smith", member.FullName);
            Assert.Equal(100, member.Amount);
        });
        Assert.NotEmpty(result.TripTravellers);
        Assert.Collection(result.TripTravellers, traveller =>
        {
            Assert.Equal("john@example.com", traveller.Email);
            Assert.Equal("John Doe", traveller.FullName);
            Assert.Equal("photo.jpg", traveller.Photo);
        });
    }

    [Fact]
    public async Task AddTripBudget_WithSharedType_CreatesBudgetAndMembers()
    {
        var tripId = Guid.NewGuid();
        var userId = Guid.NewGuid().ToString();
        var addBudgetDto = new AddTripBudgetDto(BudgetTypes.Shared, "Budget Name", "Budget Description", "USD", 500, false, new List<TripBudgetMemberDto>
                {
                    new TripBudgetMemberDto("user1@example.com", 100),
                    new TripBudgetMemberDto("user2@example.com", 200)
                });
        var user = new AppUser { Id = userId };
        _appUserRepositoryMock.Setup(repo => repo.GetFirstOrDefaultAsync(It.IsAny<Expression<Func<AppUser, bool>>>())).ReturnsAsync(user);
        _tripBudgetRepositoryMock.Setup(repo => repo.Create(It.IsAny<TripBudget>())).Returns(new TripBudget { Type = BudgetTypes.Individual, Id = Guid.NewGuid(), Budget = 500 });

        await _service.AddTripBudget(tripId, userId, addBudgetDto);

        _tripBudgetRepositoryMock.Verify(repo => repo.Create(It.IsAny<TripBudget>()), Times.Once);
        _tripBudgetMembersRepositoryMock.Verify(repo => repo.Create(It.IsAny<TripBudgetMember>()), Times.Exactly(2));
    }

    [Fact]
    public async Task EditTripBudget_UpdatesBudgetAndExpenses_Correctly()
    {
        // Arrange
        var budgetId = Guid.NewGuid();
        var dto = new EditBudgetDto(BudgetTypes.Shared, "New Budget Name", "New Budget Description", "USD", 1000, true, new List<TripBudgetMemberDto>
                {
                    new TripBudgetMemberDto("user1@example.com", 200),
                    new TripBudgetMemberDto("user2@example.com", 300)
                });
        var budget = new TripBudget { Id = budgetId };
        var expenses = new List<Expense>();
        var members = new List<TripBudgetMember>();
        _tripBudgetRepositoryMock.Setup(repo => repo.GetFirstOrDefaultAsync(It.IsAny<Expression<Func<TripBudget, bool>>>())).ReturnsAsync(budget);
        _expenseRepositoryMock.Setup(repo => repo.GetListByConditionAsync(It.IsAny< Expression<Func<Expense, bool>>>())).ReturnsAsync(expenses);
        _currencyExchangeServiceMock.Setup(service => service.GetCurrencyInformation(It.IsAny<DateTime>(), It.IsAny<string>(), It.IsAny<string>())).ReturnsAsync(1.0);
        _tripBudgetMembersRepositoryMock.Setup(repo => repo.GetListByConditionAsync(It.IsAny< Expression<Func<TripBudgetMember, bool>>>())).ReturnsAsync(members);
        _tripBudgetRepositoryMock.Setup(repo => repo.Update(It.IsAny<TripBudget>())).Returns(Task.CompletedTask);
        _tripBudgetMembersRepositoryMock.Setup(repo => repo.Delete(It.IsAny<TripBudgetMember>())).Returns(Task.CompletedTask);
        _appUserRepositoryMock.Setup(repo => repo.GetFirstOrDefaultAsync(It.IsAny< Expression<Func<AppUser, bool>>>())).ReturnsAsync(new AppUser());

        await _service.EditTripBudget(budgetId, dto);

        _tripBudgetRepositoryMock.Verify(repo => repo.Update(It.IsAny<TripBudget>()), Times.Once);
        _expenseRepositoryMock.Verify(repo => repo.Update(It.IsAny<Expense>()), Times.Exactly(0));
        _tripBudgetMembersRepositoryMock.Verify(repo => repo.Delete(It.IsAny<TripBudgetMember>()), Times.Exactly(0));
        _tripBudgetMembersRepositoryMock.Verify(repo => repo.Create(It.IsAny<TripBudgetMember>()), Times.Exactly(2));
    }

    [Fact]
    public async Task GetTripBudgets_ReturnsEmptyList_WhenNoBudgetsFound()
    {
        var tripId = Guid.NewGuid();
        var userId = "user1";
        _tripBudgetRepositoryMock.Setup(repo => repo.GetListByConditionAsync(It.IsAny<Expression<Func<TripBudget, bool>>>())).ReturnsAsync((IEnumerable<TripBudget>)null);

        var result = await _service.GetTripBudgets(tripId, userId);

        Assert.Empty(result);
    }

    [Fact]
    public async Task GetTripBudgets_ReturnsBudgets_WhenBudgetsFound()
    {
        var tripId = Guid.NewGuid();
        var userId = "user1";
        var budgets = new List<TripBudget>
            {
                new TripBudget { Id = Guid.NewGuid(), CreatorId = userId },
            };
        var tripBudgetMembers = new List<TripBudgetMember>
            {
                new TripBudgetMember { TripBudgetId = budgets[0].Id, UserId = userId, Amount = 100 }
            };
        _tripBudgetRepositoryMock.Setup(repo => repo.GetListByConditionAsync(It.IsAny<Expression<Func<TripBudget, bool>>>())).ReturnsAsync(budgets);
        _tripBudgetMembersRepositoryMock.Setup(repo => repo.FindByCondition(It.IsAny<Expression<Func<TripBudgetMember, bool>>>())).Returns(tripBudgetMembers.AsQueryable());
        _mapperMock.Setup(m => m.Map<TripBudgetDto>(It.IsAny<TripBudget>()))
            .Returns(new TripBudgetDto());

        var result = await _service.GetTripBudgets(tripId, userId);

        Assert.Equal(1, result.Count());
    }

    [Fact] 
    public async Task DeleteTripBudget_WhenBudgetNotNull_ShouldDeleteIt()
    {
        _tripBudgetRepositoryMock.Setup(repo => repo.GetFirstOrDefaultAsync(It.IsAny<Expression<Func<TripBudget, bool>>>()))
            .ReturnsAsync(new TripBudget());

        await _service.DeleteTripBudget(Guid.NewGuid());

        _tripBudgetRepositoryMock.Verify(repo => repo.Delete(It.IsAny<TripBudget>()), Times.Once);
    }
}