using Application.DTOs.Zoom;
using Application.Services;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using Application.Repositories;

namespace Infrastructure.Services;

public class ZoomService : IZoomService
{
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _configuration;
    private readonly ILogger<ZoomService> _logger;
    private readonly IAccountRepository _accountRepository;
    private string _accessToken;
    private DateTime _accessTokenExpiry = DateTime.MinValue;

    public ZoomService(HttpClient httpClient, IConfiguration configuration, ILogger<ZoomService> logger, IAccountRepository accountRepository)
    {
        _httpClient = httpClient;
        _configuration = configuration;
        _logger = logger;
        _accountRepository = accountRepository;
        
        // Validate OAuth configuration on startup
        ValidateOAuthConfiguration();
    }

    private void ValidateOAuthConfiguration()
    {
        var clientId = Environment.GetEnvironmentVariable("ZOOM_CLIENT_ID");
        var clientSecret = Environment.GetEnvironmentVariable("ZOOM_CLIENT_SECRET");
        var accountId = Environment.GetEnvironmentVariable("ZOOM_ACCOUNT_ID");

        if (string.IsNullOrEmpty(clientId) || string.IsNullOrEmpty(clientSecret) || string.IsNullOrEmpty(accountId))
        {
            _logger.LogWarning("Zoom OAuth credentials are not fully configured. Please set ZOOM_CLIENT_ID, ZOOM_CLIENT_SECRET, and ZOOM_ACCOUNT_ID environment variables.");
        }
        else
        {
            _logger.LogInformation("Zoom OAuth configuration validated successfully");
        }
    }

    private async Task<string> GetAccessTokenAsync()
    {
        if (!string.IsNullOrEmpty(_accessToken) && DateTime.UtcNow < _accessTokenExpiry)
            return _accessToken;

        var clientId = Environment.GetEnvironmentVariable("ZOOM_CLIENT_ID");
        var clientSecret = Environment.GetEnvironmentVariable("ZOOM_CLIENT_SECRET");
        var accountId = Environment.GetEnvironmentVariable("ZOOM_ACCOUNT_ID");

        if (string.IsNullOrEmpty(clientId) || string.IsNullOrEmpty(clientSecret) || string.IsNullOrEmpty(accountId))
            throw new InvalidOperationException("Zoom OAuth credentials are not set in environment variables (ZOOM_CLIENT_ID, ZOOM_CLIENT_SECRET, ZOOM_ACCOUNT_ID).");

        var auth = Convert.ToBase64String(Encoding.UTF8.GetBytes($"{clientId}:{clientSecret}"));
        using var client = new HttpClient();
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", auth);

        var content = new StringContent($"grant_type=account_credentials&account_id={accountId}", Encoding.UTF8, "application/x-www-form-urlencoded");
        var response = await client.PostAsync("https://zoom.us/oauth/token", content);

        if (!response.IsSuccessStatusCode)
        {
            var error = await response.Content.ReadAsStringAsync();
            _logger.LogError("Failed to get Zoom OAuth token: {Error}", error);
            throw new Exception($"Failed to get Zoom OAuth token: {error}");
        }

        var json = await response.Content.ReadAsStringAsync();
        var doc = JsonDocument.Parse(json);
        _accessToken = doc.RootElement.GetProperty("access_token").GetString();
        var expiresIn = doc.RootElement.GetProperty("expires_in").GetInt32();
        _accessTokenExpiry = DateTime.UtcNow.AddSeconds(expiresIn - 60); // Refresh 1 min before expiry

        _logger.LogInformation("Obtained new Zoom OAuth token, expires in {Seconds} seconds", expiresIn);
        return _accessToken;
    }

    public async Task<ZoomMeetingResponse> CreateMeetingAsync(ZoomMeetingRequest request, string memberId, string staffId)
    {
        try
        {
            var accessToken = await GetAccessTokenAsync();
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

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
            var inviteLinksResponse = await CreateInviteLinksAsync(meetingId.ToString(), memberId, staffId, 7200);

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

    public async Task<ZoomInviteLinksResponse> CreateInviteLinksAsync(string meetingId, string memberId, string staffId, int ttl = 7200)
    {
        try
        {
            var accessToken = await GetAccessTokenAsync();
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

            // Query member and staff info
            _logger.LogInformation("Looking up memberId: {MemberId}, staffId: {StaffId}", memberId, staffId);
            var member = await _accountRepository.GetAccountByIdAsync(Guid.Parse(memberId));
            var staff = await _accountRepository.GetAccountByIdAsync(Guid.Parse(staffId));
            _logger.LogInformation("Member found: {MemberFound}, Staff found: {StaffFound}", member != null, staff != null);
            if (member == null || staff == null)
                throw new Exception("Member or staff not found for Zoom invite links.");

            var attendees = new[]
            {
                new { name = $"{member.FirstName} {member.LastName}", disable_video = false, disable_audio = false },
                new { name = $"{staff.FirstName} {staff.LastName}", disable_video = false, disable_audio = false }
            };

            var body = new { attendees, ttl };
            var content = new StringContent(JsonSerializer.Serialize(body), Encoding.UTF8, "application/json");
            var response = await _httpClient.PostAsync($"https://api.zoom.us/v2/meetings/{meetingId}/invite_links", content);

            if (!response.IsSuccessStatusCode)
            {
                var errorContent = await response.Content.ReadAsStringAsync();
                _logger.LogError("Failed to create Zoom invite links. Status: {StatusCode}, Error: {Error}",
                    response.StatusCode, errorContent);
                throw new HttpRequestException($"Failed to create Zoom invite links: {response.StatusCode}");
            }

            var responseContent = await response.Content.ReadAsStringAsync();
            _logger.LogInformation("Response content: {ResponseContent}", responseContent);
            var inviteData = JsonSerializer.Deserialize<JsonElement>(responseContent);

            // The response contains an attendees array with individual invite links
            var attendeesArray = inviteData.GetProperty("attendees");
            var attendeeList = new List<string>();
            
            foreach (var attendee in attendeesArray.EnumerateArray())
            {
                if (attendee.TryGetProperty("join_url", out var joinUrlElement))
                {
                    var joinUrl = joinUrlElement.GetString();
                    if (!string.IsNullOrEmpty(joinUrl))
                    {
                        attendeeList.Add(joinUrl);
                    }
                }
            }

            // Use the first join URL as the primary join URL, or empty string if none found
            var primaryJoinUrl = attendeeList.FirstOrDefault() ?? string.Empty;

            var inviteLinksResponse = new ZoomInviteLinksResponse
            {
                MeetingId = long.Parse(meetingId),
                JoinUrl = primaryJoinUrl,
                StartUrl = string.Empty, // Zoom doesn't provide start_url in this response
                InviteLink = primaryJoinUrl // Use join URL as invite link
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

    /// <summary>
    /// Test method to verify JWT token generation without making API calls
    /// </summary>
    public string TestJwtTokenGeneration()
    {
        try
        {
            var apiKey = Environment.GetEnvironmentVariable("ZOOM_API_KEY");
            var apiSecret = Environment.GetEnvironmentVariable("ZOOM_API_SECRET");

            if (string.IsNullOrEmpty(apiKey) || string.IsNullOrEmpty(apiSecret))
            {
                throw new InvalidOperationException("Zoom API credentials are not configured properly. Please set ZOOM_API_KEY and ZOOM_API_SECRET environment variables.");
            }

            var token = GenerateJwtToken(apiKey, apiSecret);
            _logger.LogInformation("JWT token generation test successful. Token preview: {TokenPreview}", 
                token?.Substring(0, Math.Min(50, token?.Length ?? 0)) + "...");
            
            return token;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "JWT token generation test failed");
            throw;
        }
    }

    private string GenerateJwtToken(string apiKey, string apiSecret)
    {
        try
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(apiSecret);
            
            _logger.LogInformation("API Secret length: {KeyLength} bytes", key.Length);
            
            // Ensure the key is at least 32 bytes (256 bits) for HMAC-SHA256
            if (key.Length < 32)
            {
                _logger.LogWarning("API Secret is too short ({KeyLength} bytes). Padding to 32 bytes for HMAC-SHA256.", key.Length);
                var paddedKey = new byte[32];
                Array.Copy(key, paddedKey, key.Length);
                // Fill remaining bytes with zeros
                for (int i = key.Length; i < 32; i++)
                {
                    paddedKey[i] = 0;
                }
                key = paddedKey;
                _logger.LogInformation("Padded key length: {KeyLength} bytes", key.Length);
            }

            // Create the token
            var token = tokenHandler.CreateJwtSecurityToken(
                issuer: apiKey,
                audience: null, // Zoom doesn't require audience
                subject: null,
                notBefore: null,
                expires: DateTime.UtcNow.AddMinutes(30),
                issuedAt: DateTime.UtcNow,
                signingCredentials: new SigningCredentials(
                    new SymmetricSecurityKey(key), 
                    SecurityAlgorithms.HmacSha256
                )
            );

            var jwtToken = tokenHandler.WriteToken(token);

            _logger.LogInformation("JWT token created successfully. Expires: {Expires}", token.ValidTo);
            return jwtToken;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error generating JWT token");
            throw new InvalidOperationException($"Failed to generate JWT token: {ex.Message}");
        }
    }
} 