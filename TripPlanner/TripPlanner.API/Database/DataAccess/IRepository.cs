using System.Linq.Expressions;

namespace TripPlanner.API.Database.DataAccess;

public interface IRepository<T> where T : class
{
    Task<IEnumerable<T>> FindAll();

    IQueryable<T> FindByCondition(Expression<Func<T, bool>> expression);

    Task<T?> GetFirstOrDefaultAsync(Expression<Func<T, bool>> expression);

    Task<IEnumerable<T>> GetListByConditionAsync(Expression<Func<T, bool>> expression);

    T Create(T entity);

    Task Update(T entity);

    Task Delete(T entity);
}