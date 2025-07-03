using Application.DTOs.Zoom;
using Application.Services;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Services;

public class ZoomService : IZoomService
{
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _configuration;
    private readonly ILogger _logger;

    public ZoomService(HttpClient httpClient, IConfiguration configuration, ILogger<ZoomService> logger)
    {
        _httpClient = httpClient;
        _configuration = configuration;
        _logger = logger;
    }

    public async Task<ZoomMeetingResponse> CreateMeetingAsync(ZoomMeetingRequest request)
    {
        try
        {
            // Get Zoom API credentials from configuration
            var apiKey = _configuration["Zoom:ApiKey"];
            var apiSecret = _configuration["Zoom:ApiSecret"];
            var accountId = _configuration["Zoom:AccountId"];

            if (string.IsNullOrEmpty(apiKey) || string.IsNullOrEmpty(apiSecret) || string.IsNullOrEmpty(accountId))
            {
                throw new InvalidOperationException("Zoom API credentials are not configured properly.");
            }

            // Create JWT token for Zoom API authentication
            var token = GenerateJwtToken(apiKey, apiSecret);

            // Prepare the meeting creation request
            var meetingRequest = new
            {
                topic = request.Topic,
                type = request.Type,
                start_time = request.StartTime.ToString("yyyy-MM-ddTHH:mm:ss"),
                duration = request.Duration,
                timezone = request.Timezone,
                settings = new
                {
                    host_video = request.HostVideo,
                    participant_video = request.ParticipantVideo,
                    join_before_host = request.JoinBeforeHost,
                    waiting_room = request.WaitingRoom,
                    audio = "both",
                    alternative_hosts = request.AlternativeHostsEmail
                }
            };

            var json = JsonSerializer.Serialize(meetingRequest);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            // Set authorization header
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            // Create meeting
            var response = await _httpClient.PostAsync($"https://api.zoom.us/v2/users/me/meetings", content);
            
            if (!response.IsSuccessStatusCode)
            {
                var errorContent = await response.Content.ReadAsStringAsync();
                _logger.LogError("Failed to create Zoom meeting. Status: {StatusCode}, Error: {Error}", 
                    response.StatusCode, errorContent);
                throw new HttpRequestException($"Failed to create Zoom meeting: {response.StatusCode}");
            }

            var responseContent = await response.Content.ReadAsStringAsync();
            var meetingData = JsonSerializer.Deserialize<JsonElement>(responseContent);

            // Create invite links for the meeting
            var meetingId = meetingData.GetProperty("id").GetInt64();
            var inviteLinksResponse = await CreateInviteLinksAsync(meetingId.ToString());

            // Build the response
            var zoomResponse = new ZoomMeetingResponse
            {
                Id = meetingId,
                Topic = meetingData.GetProperty("topic").GetString() ?? string.Empty,
                StartTime = DateTime.Parse(meetingData.GetProperty("start_time").GetString() ?? DateTime.UtcNow.ToString()),
                Duration = meetingData.GetProperty("duration").GetInt32(),
                Timezone = meetingData.GetProperty("timezone").GetString() ?? string.Empty,
                Password = meetingData.GetProperty("password").GetString() ?? string.Empty,
                HostEmail = meetingData.GetProperty("host_email").GetString() ?? string.Empty,
                JoinUrl = inviteLinksResponse.JoinUrl,
                StartUrl = inviteLinksResponse.StartUrl,
                Settings = new ZoomMeetingSettings
                {
                    HostVideo = meetingData.GetProperty("settings").GetProperty("host_video").GetBoolean(),
                    ParticipantVideo = meetingData.GetProperty("settings").GetProperty("participant_video").GetBoolean(),
                    JoinBeforeHost = meetingData.GetProperty("settings").GetProperty("join_before_host").GetBoolean(),
                    WaitingRoom = meetingData.GetProperty("settings").GetProperty("waiting_room").GetBoolean(),
                    Audio = true
                }
            };

            _logger.LogInformation("Successfully created Zoom meeting with ID: {MeetingId}", meetingId);
            return zoomResponse;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating Zoom meeting");
            throw;
        }
    }

    public async Task<ZoomInviteLinksResponse> CreateInviteLinksAsync(string meetingId)
    {
        try
        {
            // Get Zoom API credentials from configuration
            var apiKey = _configuration["Zoom:ApiKey"];
            var apiSecret = _configuration["Zoom:ApiSecret"];

            if (string.IsNullOrEmpty(apiKey) || string.IsNullOrEmpty(apiSecret))
            {
                throw new InvalidOperationException("Zoom API credentials are not configured properly.");
            }

            // Create JWT token for Zoom API authentication
            var token = GenerateJwtToken(apiKey, apiSecret);

            // Set authorization header
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            // Create invite links
            var response = await _httpClient.PostAsync($"https://api.zoom.us/v2/meetings/{meetingId}/invite_links", null);
            
            if (!response.IsSuccessStatusCode)
            {
                var errorContent = await response.Content.ReadAsStringAsync();
                _logger.LogError("Failed to create Zoom invite links. Status: {StatusCode}, Error: {Error}", 
                    response.StatusCode, errorContent);
                throw new HttpRequestException($"Failed to create Zoom invite links: {response.StatusCode}");
            }

            var responseContent = await response.Content.ReadAsStringAsync();
            var inviteData = JsonSerializer.Deserialize<JsonElement>(responseContent);

            var inviteLinksResponse = new ZoomInviteLinksResponse
            {
                MeetingId = long.Parse(meetingId),
                JoinUrl = inviteData.GetProperty("join_url").GetString() ?? string.Empty,
                StartUrl = inviteData.GetProperty("start_url").GetString() ?? string.Empty,
                InviteLink = inviteData.GetProperty("invite_link").GetString() ?? string.Empty
            };

            _logger.LogInformation("Successfully created Zoom invite links for meeting ID: {MeetingId}", meetingId);
            return inviteLinksResponse;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating Zoom invite links for meeting ID: {MeetingId}", meetingId);
            throw;
        }
    }

    private string GenerateJwtToken(string apiKey, string apiSecret)
    {
        var header = new { alg = "HS256", typ = "JWT" };
        var payload = new
        {
            iss = apiKey,
            exp = DateTimeOffset.UtcNow.AddMinutes(30).ToUnixTimeSeconds()
        };

        var headerJson = JsonSerializer.Serialize(header);
        var payloadJson = JsonSerializer.Serialize(payload);

        var headerBase64 = Convert.ToBase64String(Encoding.UTF8.GetBytes(headerJson))
            .Replace('+', '-').Replace('/', '_').TrimEnd('=');
        var payloadBase64 = Convert.ToBase64String(Encoding.UTF8.GetBytes(payloadJson))
            .Replace('+', '-').Replace('/', '_').TrimEnd('=');

        var signature = Convert.ToBase64String(
            new System.Security.Cryptography.HMACSHA256(Encoding.UTF8.GetBytes(apiSecret))
                .ComputeHash(Encoding.UTF8.GetBytes($"{headerBase64}.{payloadBase64}")))
            .Replace('+', '-').Replace('/', '_').TrimEnd('=');

        return $"{headerBase64}.{payloadBase64}.{signature}";
    }
} 