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

    public ExpenseService(IRepository<Expense> expenseRepository, IRepository<TripBudget> tripBudgetRepository, ICurrencyExchangeService currencyExchangeService)
    {
        _expenseRepository = expenseRepository;
        _tripBudgetRepository = tripBudgetRepository;
        _currencyExchangeService = currencyExchangeService;
    }

    public async Task AddExpense(Guid budgetId, string userId, AddExpenseDto dto)
    {
        var budget = await _tripBudgetRepository.FindByCondition(t => t.Id == budgetId)
            .FirstOrDefaultAsync();

        if (budget == null)
        {
            return;
        }

        var rate = await _currencyExchangeService.GetCurrencyInformation(DateTime.UtcNow, budget.MainCurrency, dto.Currency);

        budget.SpentAmount += rate * dto.Amount;
        await _tripBudgetRepository.Update(budget);

        var expense = new Expense
        {
            Amount = dto.Amount,
            Currency = dto.Currency,
            Name = dto.Name,
            Type = dto.Type,
            AmountInMainCurrency = dto.Amount * rate,
            UserId = userId,
            TripBudgetId = budgetId,
        };

        var createdExpense = _expenseRepository.Create(expense);
    }
}