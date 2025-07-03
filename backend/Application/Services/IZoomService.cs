using Application.DTOs.Zoom;

namespace Application.Services
{
    /// <summary>
    /// Provides Zoom API integration services for creating meetings and invite links.
    /// </summary>
    public interface IZoomService
    {
        /// <summary>
        /// Creates a Zoom meeting and returns the meeting details with invite links.
        /// </summary>
        /// <param name="request">The meeting creation request containing schedule information.</param>
        /// <returns>Zoom meeting details including invite links.</returns>
        Task<ZoomMeetingResponse> CreateMeetingAsync(ZoomMeetingRequest request);

        /// <summary>
        /// Creates invite links for an existing Zoom meeting.
        /// </summary>
        /// <param name="meetingId">The Zoom meeting ID.</param>
        /// <returns>Meeting invite links.</returns>
        Task<ZoomInviteLinksResponse> CreateInviteLinksAsync(string meetingId);
    }
} 