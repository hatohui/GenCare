namespace Application.DTOs.Zoom
{
    /// <summary>
    /// Response model for Zoom invite links creation.
    /// </summary>
    public class ZoomInviteLinksResponse
    {
        /// <summary>
        /// The meeting ID.
        /// </summary>
        public long MeetingId { get; set; }

        /// <summary>
        /// The join URL for the meeting.
        /// </summary>
        public string JoinUrl { get; set; } = string.Empty;

        /// <summary>
        /// The start URL for the meeting (host only).
        /// </summary>
        public string StartUrl { get; set; } = string.Empty;

        /// <summary>
        /// The invite link for the meeting.
        /// </summary>
        public string InviteLink { get; set; } = string.Empty;
    }
} 