namespace Application.DTOs.Payment.Momo;
public class MomoConfig
{
    public string PartnerCode { get; set; } = null!;
    public string AccessKey { get; set; } = null!;
    public string SecretKey { get; set; } = null!;
    public string Endpoint { get; set; } = null!;
    public string ReturnUrl { get; set; } = null!;
    public string NotifyUrl { get; set; } = null!;
    public string RequestType { get; set; } = null!;
}
