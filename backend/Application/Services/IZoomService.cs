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
        /// <param name="memberId">The member ID.</param>
        /// <param name="staffId">The staff ID.</param>
        /// <returns>Zoom meeting details including invite links.</returns>
        Task<ZoomMeetingResponse> CreateMeetingAsync(ZoomMeetingRequest request, string memberId, string staffId);

        /// <summary>
        /// Creates invite links for an existing Zoom meeting.
        /// </summary>
        /// <param name="meetingId">The Zoom meeting ID.</param>
        /// <param name="memberId">The member ID.</param>
        /// <param name="staffId">The staff ID.</param>
        /// <param name="ttl">The time-to-live (in seconds) for the invite links.</param>
        /// <returns>Meeting invite links.</returns>
        Task<ZoomInviteLinksResponse> CreateInviteLinksAsync(string meetingId, string memberId, string staffId, int ttl = 7200);

        /// <summary>
        /// Test method to verify JWT token generation without making API calls.
        /// </summary>
        /// <returns>The generated JWT token.</returns>
        string TestJwtTokenGeneration();
    }
} 