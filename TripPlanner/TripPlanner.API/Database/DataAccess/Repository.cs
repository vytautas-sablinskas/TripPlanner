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

    public IQueryable<T> FindAll()
        => _context.Set<T>();

    public IQueryable<T> FindByCondition(Expression<Func<T, bool>> expression)
        =>
        _context.Set<T>().Where(expression);

    public void Create(T entity)
    {
        if (entity == null)
        {
            throw new ArgumentNullException("entity");
        }

        _table.Add(entity);
        _context.SaveChanges();
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
}