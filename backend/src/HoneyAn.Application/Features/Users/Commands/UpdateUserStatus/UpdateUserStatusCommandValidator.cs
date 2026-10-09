using FluentValidation;

namespace HoneyAn.Application.Features.Users.Commands.UpdateUserStatus;

public sealed class UpdateUserStatusCommandValidator : AbstractValidator<UpdateUserStatusCommand>
{
    public UpdateUserStatusCommandValidator()
    {
        RuleFor(command => command.UserId).NotEmpty();
        RuleFor(command => command.ActingUserId).NotEmpty();
    }
}
