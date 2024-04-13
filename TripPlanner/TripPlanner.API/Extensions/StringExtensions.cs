using System.Text.RegularExpressions;

namespace TripPlanner.API.Extensions;

public static class StringExtensions
{
    public static string FormatCategoryToLowerCasesSeparatedByUnderscore(this string text)
    {
        string[] words = Regex.Split(text, @"(?<!^)(?=[A-Z])");

        string formattedText = string.Join("_", words).ToLower();

        return formattedText;
    }
}