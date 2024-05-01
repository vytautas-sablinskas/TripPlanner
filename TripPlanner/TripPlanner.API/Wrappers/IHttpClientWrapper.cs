namespace TripPlanner.API.Wrappers;

public interface IHttpClientWrapper
{
    Task<HttpResponseMessage> GetAsync(string requestUri);

    Task<HttpResponseMessage> PostAsync(string requestUri, HttpContent content);

    void AddDefaultHeader(string name, string value);

    void RemoveDefaultHeader(string name);
}