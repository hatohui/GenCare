
namespace Application.Helpers;
public static class DateTimeHelper
{
    /// <summary>
    /// Chuyển đổi DateTime từ UTC sang UTC+7 (giờ Việt Nam).
    /// </summary>
    /// <param name="utcDateTime">Thời gian UTC.</param>
    /// <returns>Thời gian theo múi giờ UTC+7.</returns>
    public static DateTime ToUtc7(DateTime utcDateTime)
    {
        // Nếu DateTime chưa phải là UTC thì chuyển sang UTC trước.
        if (utcDateTime.Kind != DateTimeKind.Utc)
        {
            utcDateTime = DateTime.SpecifyKind(utcDateTime, DateTimeKind.Utc);
        }

        // Lấy múi giờ "SE Asia Standard Time" (UTC+7).
        var tz = TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time");
        return TimeZoneInfo.ConvertTimeFromUtc(utcDateTime, tz);
    }
}
