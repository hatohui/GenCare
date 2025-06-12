namespace Application.DTOs.Account.Requests;

public class GetAccountByPageRequest
{
    /// <summary>
    ///     Số thứ tự trang (tính từ 0)
    /// </summary>
    public int Page { get; set; }

    /// <summary>
    ///     Số lượng account trong mỗi trang
    /// </summary>
    public int Count { get; set; }

    /// <summary>
    ///     Tìm kiếm theo email, tên hoặc họ
    /// </summary>
    public string? Search { get; set; }

    /// <summary>
    ///     Lọc theo vai trò
    /// </summary>
    public string? Role { get; set; }

    /// <summary>
    ///     Lọc theo trạng thái hoạt động
    /// </summary>
    public bool? Active { get; set; }
}