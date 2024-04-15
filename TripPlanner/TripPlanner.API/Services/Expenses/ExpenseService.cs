﻿using Microsoft.EntityFrameworkCore;
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
            Date = dto.Date,
        };

        var createdExpense = _expenseRepository.Create(expense);

        return new CreatedExpenseResponseDto(budget.SpentAmount, createdExpense.Id, user.PhotoUri, $"{user.Name} {user.Surname}");
    }

    public async Task<DeleteExpenseResponseDto> DeleteExpense(Guid expenseId)
    {
        var expense = await _expenseRepository.FindByCondition(e => e.Id == expenseId)
            .FirstOrDefaultAsync();
        if (expense == null)
        {
            return null;
        }

        var budget = await _tripBudgetRepository.FindByCondition(b => b.Id == expense.TripBudgetId)
            .FirstOrDefaultAsync();
        if (budget == null)
        {
            return null;
        }

        var newSpentAmount = budget.SpentAmount - expense.AmountInMainCurrency < 0 ? 0 : budget.SpentAmount - expense.AmountInMainCurrency;
        budget.SpentAmount = newSpentAmount;
        await _tripBudgetRepository.Update(budget);

        await _expenseRepository.Delete(expense);


        return new DeleteExpenseResponseDto(newSpentAmount);
    }

    public async Task<EditExpenseResponseDto> EditExpense(Guid budgetId, Guid expenseId, AddExpenseDto dto)
    {
        var budget = await _tripBudgetRepository.FindByCondition(t => t.Id == budgetId)
            .FirstOrDefaultAsync();

        if (budget == null)
        {
            return null;
        }

        var rate = await _currencyExchangeService.GetCurrencyInformation(DateTime.UtcNow, budget.MainCurrency, dto.Currency);

        var currentExpense = await _expenseRepository.FindByCondition(t => t.Id == expenseId)
            .FirstOrDefaultAsync();

        var spentAmountInMainCurrency = rate * dto.Amount;
        var newAmount = budget.SpentAmount - currentExpense.AmountInMainCurrency + spentAmountInMainCurrency;
        newAmount = newAmount < 0 ? 0 : newAmount;
        budget.SpentAmount = newAmount;
        await _tripBudgetRepository.Update(budget);

        currentExpense.Currency = dto.Currency;
        currentExpense.AmountInMainCurrency = dto.Amount * rate;
        currentExpense.Amount = dto.Amount;
        currentExpense.Name = dto.Name;
        currentExpense.Type = dto.Type;
        currentExpense.Date = dto.Date;
        await _expenseRepository.Update(currentExpense);

        return new EditExpenseResponseDto(newAmount);
    }
}