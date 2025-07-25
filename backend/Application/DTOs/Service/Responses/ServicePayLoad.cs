﻿namespace Application.DTOs.Service.Responses;

public class ServicePayLoad
{
    public Guid Id { get; set; }
    public string? Name { get; set; }
    public string? Description { get; set; }
    public decimal Price { get; set; }
    public List<MediaServiceModel>? ImageUrls { get; set; }
}