namespace HoneyAn.Domain.Identity;

public static class AppRoles
{
    public const string Admin = "Admin";
    public const string Sales = "Sales";

    public static readonly IReadOnlySet<string> All =
        new HashSet<string>(StringComparer.OrdinalIgnoreCase) { Admin, Sales };
}
