﻿using AutoMapper;
using Microsoft.EntityFrameworkCore;
using TripPlanner.API.Database.DataAccess;
using TripPlanner.API.Database.Entities;
using TripPlanner.API.Database.Enums;
using TripPlanner.API.Dtos.Expenses;
using TripPlanner.API.Dtos.TripBudgets;
using TripPlanner.API.Dtos.TripTravellers;
using TripPlanner.API.Services.CurrencyExchangeService;

namespace TripPlanner.API.Services.TripBudgets;

public class TripBudgetsService : ITripBudgetsService
{
    private readonly IRepository<Traveller> _travellersRepository;
    private readonly IRepository<AppUser> _appUserRepository;
    private readonly IRepository<TripBudget> _tripBudgetRepository;
    private readonly IRepository<TripBudgetMember> _tripBudgetMembersRepository;
    private readonly IRepository<Expense> _expenseRepository;
    private readonly ICurrencyExchangeService _currencyExchangeService;
    private readonly IMapper _mapper;

    public TripBudgetsService(IRepository<Traveller> travellerRepository, IRepository<AppUser> appUserRepository, IRepository<TripBudget> tripBudgetRepository, IRepository<TripBudgetMember> tripBudgetMembersRepository, IRepository<Expense> expenseRepository, ICurrencyExchangeService currencyExchangeService, IMapper mapper)
    {
        _travellersRepository = travellerRepository;
        _appUserRepository = appUserRepository;
        _tripBudgetRepository = tripBudgetRepository;
        _tripBudgetMembersRepository = tripBudgetMembersRepository;
        _expenseRepository = expenseRepository;
        _currencyExchangeService = currencyExchangeService;
        _mapper = mapper;
    }

    public IEnumerable<TripTravellerMinimalDto> GetTripTravellers(Guid tripId)
    {
        var travellers = _travellersRepository.FindByCondition(t => t.TripId == tripId)
            .Include(t => t.User);

        var travellerMinimalDtos = travellers.Select(t => new TripTravellerMinimalDto(t.User.Id, t.User.Email, $"{t.User.Name} {t.User.Surname}", t.User.PhotoUri));

        return travellerMinimalDtos;
    }

    public async Task<TripBudgetMainViewDto> GetTripBudgetById(Guid budgetId, string userId)
    {
        var budget = _tripBudgetRepository.FindByCondition(t => t.Id == budgetId)
            .Include(b => b.Expenses)
            .FirstOrDefault();

        var expenses = budget.Expenses
            .Where(e => budget.Type == BudgetTypes.IndividualWithFixedAmount ? e.UserId == userId : true);

        var expensesDto = expenses
            .Select(e => {
            var user = _appUserRepository.FindByCondition(t => t.Id == e.UserId)
                .FirstOrDefault();

            return new ExpenseDto(
                e.Id,
                e.Currency,
                e.Amount,
                e.AmountInMainCurrency,
                e.Name,
                e.Type,
                user.PhotoUri,
                $"{user.Name} {user.Surname}",
                e.Date
            );   
        });

        var spentAmount = budget.SpentAmount;
        var totalBudget = budget.Budget;
        if (budget.Type == BudgetTypes.IndividualWithFixedAmount)
        {
            spentAmount = expenses.Sum(e => e.AmountInMainCurrency);
            var member = await _tripBudgetMembersRepository.GetFirstOrDefaultAsync(m => m.TripBudgetId == budgetId && m.UserId == userId);
            totalBudget = member.Amount;
        }

        return new TripBudgetMainViewDto(
            budget.Id,
            budget.MainCurrency,
            budget.UnlimitedBudget ?? false,
            spentAmount,
            totalBudget,
            expensesDto
        );
    }

    public async Task<EditBudgetCurrentInfoDto> GetEditBudgetCurrentInfo(Guid tripId, Guid budgetId)
    {
        var travellers = _travellersRepository.FindByCondition(t => t.TripId == tripId)
            .Include(t => t.User);

        var travellerMinimalDtos = travellers.Select(t => new TripTravellerMinimalDto(t.User.Id, t.User.Email, $"{t.User.Name} {t.User.Surname}", t.User.PhotoUri))
            .ToList();

        var budget = _tripBudgetRepository.FindByCondition(t => t.Id == budgetId)
            .Include(b => b.BudgetMembers)
            .ThenInclude(b => b.User)
            .FirstOrDefault();


        IEnumerable<TripBudgetMemberWithNameDto> budgetMembersDto = new List<TripBudgetMemberWithNameDto>();
        if (budget?.BudgetMembers?.Count > 0)
        {
            budgetMembersDto = budget.BudgetMembers.Select(b => new TripBudgetMemberWithNameDto(b.User.Email, $"{b.User.Name} {b.User.Surname}", b.Amount));
        }

        var dto = new EditBudgetCurrentInfoDto
        {
            Name = budget.Name,
            Description = budget.Description,
            MainCurrency = budget.MainCurrency,
            UnlimitedBudget = budget.UnlimitedBudget ?? false,
            Type = budget.Type,
            Amount = budget.Budget,
            BudgetMembers = budgetMembersDto,
            TripTravellers = travellerMinimalDtos,
        };

        return dto;
    }

    public async Task AddTripBudget(Guid tripId, string userId, AddTripBudgetDto addBudgetDto)
    {
        var user = await _appUserRepository.GetFirstOrDefaultAsync(t => t.Id == userId);

        var budget = new TripBudget
        {
            Name = addBudgetDto.Name,
            Description = addBudgetDto.Description,
            Type = addBudgetDto.Type,
            UnlimitedBudget = addBudgetDto.UnlimitedAmount,
            Budget = addBudgetDto.Budget,
            TripId = tripId,
            MainCurrency = addBudgetDto.MainCurrency,
            CreatorId = userId,
        };

        var createdBudget = _tripBudgetRepository.Create(budget);
        if (createdBudget.Type == BudgetTypes.Individual)
        {
            var members = new List<TripBudgetMember>
            {
                new()
                {
                    TripBudgetId = createdBudget.Id,
                    UserId = userId,
                    Amount = createdBudget.Budget
                }
            };

            createdBudget.BudgetMembers = members;
            await _tripBudgetRepository.Update(createdBudget);
        }

        if (addBudgetDto.Members != null)
        {
            foreach (var member in addBudgetDto.Members)
            {
                var userToAdd = await _appUserRepository
                    .GetFirstOrDefaultAsync(t => t.Email == member.Email);
                var budgetMember = new TripBudgetMember
                {
                    UserId = userToAdd.Id,
                    TripBudgetId = createdBudget.Id,
                    Amount = member.Amount
                };

                _tripBudgetMembersRepository.Create(budgetMember);
            }
        }
    }

    public async Task EditTripBudget(Guid budgetId, EditBudgetDto dto)
    {
        var budget = await _tripBudgetRepository
            .GetFirstOrDefaultAsync(b => b.Id == budgetId);
        if (budget is null)
        {
            return;
        }

        double newSpentAmount = 0;
        var expenses = await _expenseRepository.GetListByConditionAsync(e => e.TripBudgetId == budgetId);
        foreach (var expense in expenses)
        {
            var newRate = await _currencyExchangeService.GetCurrencyInformation(DateTime.UtcNow, dto.MainCurrency, expense.Currency);

            expense.AmountInMainCurrency = expense.Amount * newRate;
            newSpentAmount += expense.AmountInMainCurrency;
            await _expenseRepository.Update(expense);
        }

        budget.Name = dto.Name;
        budget.Description = dto.Description;
        budget.Type = dto.Type;
        budget.UnlimitedBudget = dto.UnlimitedAmount;
        budget.Budget = dto.Budget;
        budget.MainCurrency = dto.MainCurrency;
        budget.BudgetMembers = new List<TripBudgetMember>();
        budget.SpentAmount = newSpentAmount;

        await _tripBudgetRepository.Update(budget);

        var oldMembers = await _tripBudgetMembersRepository.GetListByConditionAsync(t => t.TripBudgetId == budgetId);
        foreach (var member in oldMembers)
        {
            await _tripBudgetMembersRepository.Delete(member);
        }

        if (dto.Members != null)
        {
            foreach (var member in dto.Members)
            {
                var userToAdd = await _appUserRepository.GetFirstOrDefaultAsync(t => t.Email == member.Email);
                var budgetMember = new TripBudgetMember
                {
                    UserId = userToAdd.Id,
                    TripBudgetId = budget.Id,
                    Amount = member.Amount
                };

                _tripBudgetMembersRepository.Create(budgetMember);
            }
        }
    }

    public async Task<IEnumerable<TripBudgetDto>> GetTripBudgets(Guid tripId, string userId)
    {
        var budgets = await _tripBudgetRepository.GetListByConditionAsync(t => t.TripId == tripId && (t.CreatorId == userId || t.BudgetMembers != null && t.BudgetMembers.Any(m => m.UserId == userId)));

        if (budgets == null)
        {
            return new List<TripBudgetDto>();
        }

        budgets = budgets.Select((budget) =>
        {
            var member = _tripBudgetMembersRepository.FindByCondition(t => t.TripBudgetId == budget.Id && t.UserId == userId)
                .FirstOrDefault();

            if (budget.Type == BudgetTypes.IndividualWithFixedAmount && budget.CreatorId != userId)
            {
                budget.Budget = member.Amount;
            }

            return budget;
        }).ToList();

        var budgetDtos = budgets.Select((budget) =>
        {
            var budgetDto = _mapper.Map<TripBudgetDto>(budget);
            budget.SpentAmount = budget.SpentAmount;
            budgetDto.IsCreator = budget.CreatorId == userId;

            return budgetDto;
        }).ToList();

        return budgetDtos;
    }

    public async Task DeleteTripBudget(Guid budgetId)
    {
        var budget = await _tripBudgetRepository.GetFirstOrDefaultAsync(b => b.Id == budgetId);
        if (budget == null)
        {
            return;
        }

        await _tripBudgetRepository.Delete(budget);
    }
}