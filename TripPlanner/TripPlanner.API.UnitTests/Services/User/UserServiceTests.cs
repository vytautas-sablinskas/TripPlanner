using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;
using TripPlanner.API.Database.DataAccess;
using TripPlanner.API.Database.Entities;
using TripPlanner.API.Database.Enums;
using TripPlanner.API.Services.User;

namespace TripPlanner.API.UnitTests.Services.User
{
    public class UserServiceTests
    {
        private readonly Mock<IRepository<Notification>> _notificationRepositoryMock;
        private readonly Mock<IRepository<AppUser>> _appUserRepositoryMock;
        private readonly UserService _service;

        public UserServiceTests()
        {
            _notificationRepositoryMock = new Mock<IRepository<Notification>>();
            _appUserRepositoryMock = new Mock<IRepository<AppUser>>();
            _service = new UserService(_notificationRepositoryMock.Object, _appUserRepositoryMock.Object);
        }

        [Fact]
        public async Task GetUserInformation_ReturnsUserInformationDto_WithUnreadNotifications()
        {
            var userId = "user1";
            var notifications = new List<Notification>
            {
                new Notification { Id = Guid.NewGuid(), UserId = userId, Status = NotificationStatus.Unread },
                new Notification { Id = Guid.NewGuid(), UserId = userId, Status = NotificationStatus.Read }
            };
            var user = new AppUser { Id = userId, PhotoUri = "photo_uri" };

            _notificationRepositoryMock.Setup(repo => repo.FindByCondition(It.IsAny<Expression<Func<Notification, bool>>>()))
                .Returns(notifications.AsQueryable());
            _appUserRepositoryMock.Setup(repo => repo.GetFirstOrDefaultAsync(It.IsAny<Expression<Func<AppUser, bool>>>()))
                .ReturnsAsync(user);

            var result = await _service.GetUserInformation(userId);

            Assert.NotNull(result);
            Assert.True(result.HasUnreadNotifications);
            Assert.Equal("photo_uri", result.Photo);
        }
    }
}
