namespace Application.DTOs.Zoom
{
    /// <summary>
    /// Request model for creating a Zoom meeting.
    /// </summary>
    public class ZoomMeetingRequest
    {
        /// <summary>
        /// The topic/title of the meeting.
        /// </summary>
        public string Topic { get; set; } = string.Empty;

        /// <summary>
        /// The start time of the meeting in ISO 8601 format.
        /// </summary>
        public DateTime StartTime { get; set; }

        /// <summary>
        /// The duration of the meeting in minutes.
        /// </summary>
        public int Duration { get; set; } = 120;

        /// <summary>
        /// The timezone for the meeting (e.g., "America/New_York").
        /// </summary>
        public string Timezone { get; set; } = "Asia/Ho_Chi_Minh";

        /// <summary>
        /// The type of meeting (1=instant, 2=scheduled, 3=recurring with no fixed time, 8=recurring with fixed time).
        /// </summary>
        public int Type { get; set; } = 2;

        /// <summary>
        /// Whether to enable join before host.
        /// </summary>
        public bool JoinBeforeHost { get; set; } = true;

        /// <summary>
        /// Whether to enable waiting room.
        /// </summary>
        public bool WaitingRoom { get; set; } = true;

        /// <summary>
        /// Whether to enable host video.
        /// </summary>
        public bool HostVideo { get; set; } = true;

        /// <summary>
        /// Whether to enable participant video.
        /// </summary>
        public bool ParticipantVideo { get; set; } = true;

        /// <summary>
        /// Whether to enable audio (both telephony and computer audio).
        /// </summary>
        public bool Audio { get; set; } = true;

        /// <summary>
        /// Whether to enable alternative hosts.
        /// </summary>
        public bool AlternativeHosts { get; set; } = false;

        /// <summary>
        /// Alternative host email addresses.
        /// </summary>
        public string? AlternativeHostsEmail { get; set; }
    }
} 