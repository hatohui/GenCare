namespace Application.Services;
public interface IOrderDetailPdfService
{
    Task<byte[]?> GenerateResultPdfAsync(Guid orderDetailId, CancellationToken cancellationToken = default);
}