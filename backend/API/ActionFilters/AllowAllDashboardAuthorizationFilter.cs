using Hangfire.Dashboard;

namespace API.ActionFilters;

public class AllowAllDashboardAuthorizationFilter : IDashboardAuthorizationFilter
{
    public bool Authorize(DashboardContext context)
    {
        return true;
    }
}