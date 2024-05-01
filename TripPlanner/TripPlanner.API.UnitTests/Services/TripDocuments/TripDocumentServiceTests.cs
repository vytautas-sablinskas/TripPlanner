using Microsoft.AspNetCore.Http;
using Moq;
using System.Linq.Expressions;
using System.Reflection.Metadata;
using TripPlanner.API.Database.DataAccess;
using TripPlanner.API.Database.Entities;
using TripPlanner.API.Dtos.TripDocuments;
using TripPlanner.API.Services.AzureBlobStorage;
using TripPlanner.API.Services.TripDocuments;

namespace TripPlanner.API.UnitTests.Services.TripDocuments;

public class TripDocumentServiceTests
{
    private readonly Mock<IAzureBlobStorageService> _azureBlobStorageServiceMock;
    private readonly Mock<IRepository<TripDocument>> _tripDocumentRepositoryMock;
    private readonly Mock<IRepository<AppUser>> _appUserRepositoryMock;
    private readonly Mock<IRepository<TripDocumentMember>> _tripDocumentMemberRepositoryMock;
    private readonly TripDocumentService _service;

    public TripDocumentServiceTests()
    {
        _azureBlobStorageServiceMock = new Mock<IAzureBlobStorageService>();
        _tripDocumentRepositoryMock = new Mock<IRepository<TripDocument>>();
        _appUserRepositoryMock = new Mock<IRepository<AppUser>>();
        _tripDocumentMemberRepositoryMock = new Mock<IRepository<TripDocumentMember>>();
        _service = new TripDocumentService(_azureBlobStorageServiceMock.Object, _tripDocumentRepositoryMock.Object, _appUserRepositoryMock.Object, _tripDocumentMemberRepositoryMock.Object);
    }

    [Fact]
    public async Task GetUserDocuments_ShouldReturnUserDocuments()
    {
        // Arrange
        var userId = Guid.NewGuid().ToString();
        var documents = new List<TripDocument>
            {
                new TripDocument { Id = Guid.NewGuid(), Name = "Document 1", LinkToFile = "link1", TypeOfFile = "pdf", CreatorId = userId },
                new TripDocument { Id = Guid.NewGuid(), Name = "Document 2", LinkToFile = "link2", TypeOfFile = "docx", CreatorId = userId },
            };
        _tripDocumentRepositoryMock.Setup(r => r.GetListByConditionAsync(It.IsAny<Expression<Func<TripDocument, bool>>>()))
            .ReturnsAsync(documents);

        var result = await _service.GetUserDocuments(userId);

        Assert.NotNull(result);
        Assert.Equal(2, result.Count());
    }

    [Fact]
    public async Task AddNewDocument_WhenUploadIsSuccessful_ReturnsSuccessAndDocumentDto()
    {
        var userId = Guid.NewGuid().ToString();
        var tripDetailId = Guid.NewGuid();
        var dto = new AddNewTripDocumentDto("Document Name", new FormFile(null, 0, 0, "document", "document.txt") { Headers = new HeaderDictionary { { "Content-Type", "text/plain" } } }, "test", false);
        var uploadResult = (true, "https://example.com/document.txt");
        _azureBlobStorageServiceMock.Setup(x => x.UploadFileAsync(It.IsAny<IFormFile>())).ReturnsAsync(uploadResult);

        var createdDocument = new TripDocument
        {
            Id = Guid.NewGuid(),
            Name = dto.Name,
            CreatorId = userId,
            LinkToFile = uploadResult.Item2,
            TripDetailId = tripDetailId,
            TypeOfFile = "type",
            IsPrivateDocument = dto.IsPrivate
        };

        _tripDocumentRepositoryMock.Setup(x => x.Create(It.IsAny<TripDocument>())).Returns(createdDocument);

        var result = await _service.AddNewDocument(userId, tripDetailId, dto);

        Assert.True(result.Item1);
        Assert.NotNull(result.Item2);
    }

    [Fact]
    public async Task GetDocumentMembers_ShouldReturnDocumentWithMembers()
    {
        var documentId = Guid.NewGuid();
        var memberId1 = Guid.NewGuid().ToString();
        var memberId2 = Guid.NewGuid().ToString();

        var document = new TripDocument
        {
            Id = documentId,
            IsPrivateDocument = true,
            Members = new List<TripDocumentMember>
            {
                new TripDocumentMember { MemberId = memberId1 },
                new TripDocumentMember { MemberId = memberId2 }
            }
        };

        _tripDocumentRepositoryMock.Setup(x => x.FindByCondition(It.IsAny<Expression<Func<TripDocument, bool>>>()))
            .Returns(new List<TripDocument> { document }.AsQueryable());

        var result = await _service.GetDocumentMembers(documentId);

        Assert.NotNull(result);
        Assert.Equal(2, result.MemberIds.Count());
        Assert.Contains(memberId1, result.MemberIds);
        Assert.Contains(memberId2, result.MemberIds);
    }

    [Fact]
    public async Task EditDocument_Returns_True_After_Successful_Edit()
    {
        var documentId = Guid.NewGuid();
        var memberIds = new List<string> { "memberId1", "memberId2" };
        var dto = new EditDocumentDto("Updated Document Name", true, memberIds);
        var document = new TripDocument
        {
            Id = documentId,
            Name = "Original Document Name",
            IsPrivateDocument = false,
            Members = new List<TripDocumentMember>
            {
                new TripDocumentMember { MemberId = "existingMemberId" }
            }
        };

        _tripDocumentRepositoryMock.Setup(x => x.GetFirstOrDefaultAsync(It.IsAny<Expression<Func<TripDocument, bool>>>()))
            .ReturnsAsync(document);

        _tripDocumentMemberRepositoryMock.Setup(x => x.GetListByConditionAsync(It.IsAny<Expression<Func<TripDocumentMember, bool>>>()))
            .ReturnsAsync(document.Members);

        var result = await _service.EditDocument(documentId, dto);

        Assert.True(result);
        _tripDocumentMemberRepositoryMock.Verify(x => x.Delete(It.IsAny<TripDocumentMember>()), Times.Exactly(document.Members.Count));
    }

    [Fact]
    public async Task DeleteDocument_Returns_True_After_Successful_Deletion()
    {
        var documentId = Guid.NewGuid();
        var document = new TripDocument
        {
            Id = documentId,
            LinkToFile = "file://document.txt"
        };

        _tripDocumentRepositoryMock.Setup(x => x.GetFirstOrDefaultAsync(It.IsAny<Expression<Func<TripDocument, bool>>>()))
            .ReturnsAsync(document);

        var result = await _service.DeleteDocument(documentId);

        Assert.True(result);
        _tripDocumentRepositoryMock.Verify(x => x.Delete(document), Times.Once);
        _azureBlobStorageServiceMock.Verify(x => x.DeleteFileAsync(document.LinkToFile), Times.Once);
    }
}