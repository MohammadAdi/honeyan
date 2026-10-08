using HoneyAn.Application.Common.Models;

namespace HoneyAn.UnitTests.Common.Models;

public sealed class ApiResponseTests
{
    [Fact]
    public void Ok_CreatesSuccessfulResponse()
    {
        var response = ApiResponse<string>.Ok("value", "done");

        Assert.True(response.Success);
        Assert.Equal("value", response.Data);
        Assert.Equal("done", response.Message);
        Assert.Null(response.Error);
    }

    [Fact]
    public void Failure_CreatesStandardErrorResponse()
    {
        var response = ApiResponse<object>.Failure("test_error", "Test detail");

        Assert.False(response.Success);
        Assert.Null(response.Data);
        Assert.Equal("test_error", response.Error?.Code);
        Assert.Equal("Test detail", response.Error?.Detail);
    }
}
