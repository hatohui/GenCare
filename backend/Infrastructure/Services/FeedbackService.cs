﻿using Application.DTOs.Feedback;
using Application.Repositories;
using Application.Services;
using Domain.Common.Constants;
using Domain.Entities;
using Domain.Exceptions;

namespace Infrastructure.Services;

public class FeedbackService(IFeedbackRepository feedbackRepository,
    IAccountRepository accountRepository,
    IServiceRepository serviceRepository) : IFeedbackService
{
    public async Task AddFeedbackAsync(FeedbackCreateRequest request, string accountId)
    {
        Account account = await accountRepository.GetAccountByIdAsync(Guid.Parse(accountId))
            ?? throw new AppException(404, "Account not found");
        Service service = await serviceRepository.SearchServiceByIdAsync(Guid.Parse(request.ServiceId))
            ?? throw new AppException(404, "Service not found");

        Feedback feedback = new()
        {
            Detail = request.Detail,
            Rating = request.Rating,
            CreatedAt = DateTime.Now,
            Service = service,
            CreatedBy = account.Id
        };
        await feedbackRepository.Add(feedback);
    }

    public async Task DeleteFeedbackAsync(string feedbackId, string role, string accountId)
    {
        //get feedback by id
        Feedback feedback = await feedbackRepository.GetById(feedbackId) ?? throw new AppException(404, "Feedback not found");
        //check valid
        var check = false;
        if (role.ToLower() == RoleNames.Admin.ToLower() || role.ToLower() == RoleNames.Manager.ToLower())
        {
            check = true;
        }
        else if (role.ToLower() == RoleNames.Member.ToLower())
        {
            //check if feedback is created by that account
            if (feedback.CreatedBy == Guid.Parse(accountId))
            {
                check = true;
            }
        }
        //delete feedback
        if (check) await feedbackRepository.Delete(feedback);
        else throw new AppException(403, "You are not allowed to delete this feedback");
    }

    public async Task<List<FeedbackViewByServiceResponse>> GetAllFeedbackByServiceAsync(string serviceId)
    {
        var feedbacks = await feedbackRepository.GetAll();
        //filter feedbacks
        feedbacks = feedbacks.Where(f => f.ServiceId == Guid.Parse(serviceId)).ToList();
        //fill FeedbackViewByServiceResponse
        List<FeedbackViewByServiceResponse> rs = new();
        foreach (var feedback in feedbacks)
        {
            var account = await accountRepository.GetAccountByIdAsync(feedback.CreatedBy);
            if (account == null)
            {
                throw new AppException(404, "Account not found for feedback");
            }
            var feedbackView = new FeedbackViewByServiceResponse
            {
                Id = feedback.Id.ToString("D"),
                Detail = feedback.Detail,
                Rating = feedback.Rating,
                CreatedAt = feedback.CreatedAt,
                AccountId = feedback.CreatedBy.ToString("D"),
                AccountName = $"{account.FirstName} {account.LastName}",
                ServiceName = feedback.Service.Name
            };
            rs.Add(feedbackView);
        }
        return rs;
    }

    public async Task UpdateFeedbackAsync(FeedbackUpdateRequest request, string feedbackId, string accountId)
    {
        //get feedback by id
        Feedback feedback = await feedbackRepository.GetById(feedbackId) ?? throw new AppException(404, "Feedback not found");
        //check if feedback is created by that account
        if (feedback.CreatedBy != Guid.Parse(accountId))
        {
            throw new AppException(403, "You are not allowed to update this feedback");
        }
        //update feedback
        feedback.Detail = request.Detail ?? feedback.Detail;
        feedback.Rating = request.Rating ?? feedback.Rating;
        //update to db
        await feedbackRepository.Update(feedback);
    }
}