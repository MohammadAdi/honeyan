using FluentValidation;
using HoneyAn.Domain.Identity;

namespace HoneyAn.Application.Features.Users.Commands.CreateUser;

public sealed class CreateUserCommandValidator : AbstractValidator<CreateUserCommand>
{
    public CreateUserCommandValidator()
    {
        RuleFor(command => command.Email).NotEmpty().EmailAddress();
        RuleFor(command => command.DisplayName).NotEmpty().MaximumLength(150);
        RuleFor(command => command.Role).Must(AppRoles.All.Contains).WithMessage("Role must be Admin or Sales.");
        RuleFor(command => command.InitialPassword).NotEmpty().MinimumLength(12);
    }
}
