using Microsoft.AspNetCore.Mvc;

namespace ConversationService.Api.Controllers;

[ApiController]
[Route("/api/[controller]")]
public class ConversationsController : ControllerBase
{
    [HttpGet]
    public IActionResult GetConversations()
    {
        return Ok(new { Message = "List of conversations" });
    }

    [HttpPost]
    public IActionResult CreateConversation([FromBody] object conversation)
    {
        return CreatedAtAction(nameof(GetConversations), new { Id = Guid.NewGuid() }, conversation);
    }
}