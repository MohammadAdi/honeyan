using FluentValidation;

namespace HoneyAn.Application.Features.Auth.Commands.Logout;

public sealed class LogoutCommandValidator : AbstractValidator<LogoutCommand>
{
    public LogoutCommandValidator() => RuleFor(command => command.UserId).NotEmpty();
}
