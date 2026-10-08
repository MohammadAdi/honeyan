using HoneyAn.Domain.Identity;

namespace HoneyAn.UnitTests.Identity;

public sealed class RefreshSessionTests
{
    [Fact]
    public void IsActive_RequiresFutureExpiryAndNoRevocation()
    {
        var now = DateTimeOffset.UtcNow;
        var session = new RefreshSession
        {
            UserId = Guid.NewGuid(),
            FamilyId = Guid.NewGuid(),
            TokenHash = new string('A', 64),
            CreatedAt = now,
            ExpiresAt = now.AddMinutes(1)
        };

        Assert.True(session.IsActive(now));
        session.RevokedAt = now;
        Assert.False(session.IsActive(now));
        session.RevokedAt = null;
        Assert.False(session.IsActive(now.AddMinutes(2)));
    }
}
