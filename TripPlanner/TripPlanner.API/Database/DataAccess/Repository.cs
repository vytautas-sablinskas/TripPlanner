using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace TripPlanner.API.Database.DataAccess;

public class Repository<T> : IRepository<T> where T : class
{
    private readonly AppDbContext _context;
    private readonly DbSet<T> _table;

    public Repository(AppDbContext _context)
    {
        this._context = _context;
        _table = _context.Set<T>();
    }

    public async Task<IEnumerable<T>> FindAll()
        => await _context.Set<T>().ToListAsync();

    public IQueryable<T> FindByCondition(Expression<Func<T, bool>> expression)
        =>
        _context.Set<T>().Where(expression);

    public T Create(T entity)
    {
        if (entity == null)
        {
            throw new ArgumentNullException("entity");
        }

        var entry = _table.Add(entity);
        _context.SaveChanges();

        return entry.Entity;
    }

    public async Task Update(T entity)
    {
        if (entity == null)
        {
            throw new ArgumentNullException("entity");
        }

        _table.Update(entity);
        await _context.SaveChangesAsync();
    }

    public async Task Delete(T entity)
    {
        if (entity == null)
        {
            throw new ArgumentNullException("entity");
        }

        _table.Remove(entity);
        await _context.SaveChangesAsync();
    }

    public async Task<IEnumerable<T>> GetListByConditionAsync(Expression<Func<T, bool>> expression)
        => await _context.Set<T>().Where(expression).ToListAsync();

    public async Task<T?> GetFirstOrDefaultAsync(Expression<Func<T, bool>> expression)
        => await _context.Set<T>().Where(expression).FirstOrDefaultAsync();
}