using Microsoft.EntityFrameworkCore;
using TripPlanner.API.Database.DataAccess;
using TripPlanner.API.Database.Entities;
using TripPlanner.API.Dtos.Expenses;
using TripPlanner.API.Services.CurrencyExchangeService;

namespace TripPlanner.API.Services.Expenses;

public class ExpenseService : IExpenseService
{
    private readonly IRepository<TripBudget> _tripBudgetRepository;
    private readonly IRepository<Expense> _expenseRepository;
    private readonly ICurrencyExchangeService _currencyExchangeService;
    private readonly IRepository<AppUser> _appUserRepository;

    public ExpenseService(IRepository<Expense> expenseRepository, IRepository<TripBudget> tripBudgetRepository, ICurrencyExchangeService currencyExchangeService, IRepository<AppUser> appUserRepository)
    {
        _expenseRepository = expenseRepository;
        _tripBudgetRepository = tripBudgetRepository;
        _currencyExchangeService = currencyExchangeService;
        _appUserRepository = appUserRepository;
    }

    public async Task<CreatedExpenseResponseDto> AddExpense(Guid budgetId, string userId, AddExpenseDto dto)
    {
        var budget = await _tripBudgetRepository.FindByCondition(t => t.Id == budgetId)
            .FirstOrDefaultAsync();

        if (budget == null)
        {
            return null;
        }

        var rate = await _currencyExchangeService.GetCurrencyInformation(DateTime.UtcNow, budget.MainCurrency, dto.Currency);

        var spentAmountInMainCurrency = rate * dto.Amount;
        budget.SpentAmount += spentAmountInMainCurrency;
        await _tripBudgetRepository.Update(budget);

        var user = await _appUserRepository.FindByCondition(t => t.Id == userId)
            .FirstOrDefaultAsync();

        var expense = new Expense
        {
            Amount = dto.Amount,
            Currency = dto.Currency,
            Name = dto.Name,
            Type = dto.Type,
            AmountInMainCurrency = spentAmountInMainCurrency,
            UserId = userId,
            TripBudgetId = budgetId,
        };

        var createdExpense = _expenseRepository.Create(expense);

        return new CreatedExpenseResponseDto(budget.SpentAmount, createdExpense.Id, user.PhotoUri, $"{user.Name} {user.Surname}");
    }
}