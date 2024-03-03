namespace TripPlanner.API.Utils;

public record Result
(
    bool Success,
    string? Message
);

public record Result<T>
(
    bool Success,
    string? Message,
    T? Data
);