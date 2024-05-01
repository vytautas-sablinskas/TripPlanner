namespace TripPlanner.API.Wrappers;

public class HttpClientWrapper : IHttpClientWrapper
{
    private readonly HttpClient _httpClient;

    public HttpClientWrapper(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<HttpResponseMessage> GetAsync(string requestUri)
    {
        return await _httpClient.GetAsync(requestUri);
    }

    public async Task<HttpResponseMessage> PostAsync(string requestUri, HttpContent content)
    {
        return await _httpClient.PostAsync(requestUri, content);
    }

    public void AddDefaultHeader(string name, string value) => _httpClient.DefaultRequestHeaders.Add(name, value);

    public void RemoveDefaultHeader(string name) => _httpClient.DefaultRequestHeaders.Remove(name);
}