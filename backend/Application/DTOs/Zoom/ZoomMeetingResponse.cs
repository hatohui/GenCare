namespace Application.DTOs.Zoom
{
    /// <summary>
    /// Response model for Zoom meeting creation.
    /// </summary>
    public class ZoomMeetingResponse
    {
        /// <summary>
        /// The unique identifier of the meeting.
        /// </summary>
        public long Id { get; set; }

        /// <summary>
        /// The topic/title of the meeting.
        /// </summary>
        public string Topic { get; set; } = string.Empty;

        /// <summary>
        /// The start time of the meeting.
        /// </summary>
        public DateTime StartTime { get; set; }

        /// <summary>
        /// The duration of the meeting in minutes.
        /// </summary>
        public int Duration { get; set; }

        /// <summary>
        /// The timezone for the meeting.
        /// </summary>
        public string Timezone { get; set; } = string.Empty;

        /// <summary>
        /// The password for the meeting.
        /// </summary>
        public string Password { get; set; } = string.Empty;

        /// <summary>
        /// The host email.
        /// </summary>
        public string HostEmail { get; set; } = string.Empty;

        /// <summary>
        /// The join URL for the meeting.
        /// </summary>
        public string JoinUrl { get; set; } = string.Empty;

        /// <summary>
        /// The start URL for the meeting (host only).
        /// </summary>
        public string StartUrl { get; set; } = string.Empty;

        /// <summary>
        /// The meeting settings.
        /// </summary>
        public ZoomMeetingSettings Settings { get; set; } = new();
    }

    /// <summary>
    /// Zoom meeting settings.
    /// </summary>
    public class ZoomMeetingSettings
    {
        /// <summary>
        /// Whether to enable host video.
        /// </summary>
        public bool HostVideo { get; set; }

        /// <summary>
        /// Whether to enable participant video.
        /// </summary>
        public bool ParticipantVideo { get; set; }

        /// <summary>
        /// Whether to enable join before host.
        /// </summary>
        public bool JoinBeforeHost { get; set; }

        /// <summary>
        /// Whether to enable waiting room.
        /// </summary>
        public bool WaitingRoom { get; set; }

        /// <summary>
        /// Whether to enable audio.
        /// </summary>
        public bool Audio { get; set; }
    }
} 