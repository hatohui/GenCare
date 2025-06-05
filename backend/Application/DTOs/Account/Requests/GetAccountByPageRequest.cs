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
}