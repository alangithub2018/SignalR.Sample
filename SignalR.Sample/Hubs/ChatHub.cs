using Microsoft.AspNetCore.SignalR;
using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Templates.Blazor;
using SignalR.Sample.Data;
using System.Security.Claims;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace SignalR.Sample.Hubs
{
    public class ChatHub : Hub
    {
        private readonly ApplicationDbContext _context;

        public ChatHub(ApplicationDbContext context)
        {
            _context = context;
        }

        public override Task OnConnectedAsync()
        {
            var userId = Context.User!.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!string.IsNullOrEmpty(userId))
            {
                var userName = _context.Users.FirstOrDefault(u => u.Id == userId)!.UserName;
                Clients.Users(HubConnections.OnlineUsers()).SendAsync("ReceiveUserConnected", userId, userName);
                HubConnections.AddUserConnection(userId, Context.ConnectionId);
            }
            return base.OnConnectedAsync();
        }

        public override Task OnDisconnectedAsync(Exception? exception)
        {
            var userId = Context.User!.FindFirstValue(ClaimTypes.NameIdentifier);
            
            if (HubConnections.HasUserConnection(userId!, Context.ConnectionId))
            {
                var userConnections = HubConnections.Users[userId!];
                // Remove diconnected connection from our list
                userConnections.Remove(Context.ConnectionId);

                // Remove userId and connections
                HubConnections.Users.Remove(userId!);
                if (userConnections.Any())
                {
                    HubConnections.Users.Add(userId!, userConnections);
                }
            }

            if (!string.IsNullOrEmpty(userId))
            {
                var userName = _context.Users.FirstOrDefault(u => u.Id == userId)!.UserName;
                Clients.Users(HubConnections.OnlineUsers()).SendAsync("ReceiveUserDisconnected", userId, userName);
                HubConnections.AddUserConnection(userId, Context.ConnectionId);
            }
            return base.OnDisconnectedAsync(exception);
        }

        public async Task SendAddRoomMessage(int maxRoom, int roomId, string roomName)
        {
            var userId = Context.User!.FindFirstValue(ClaimTypes.NameIdentifier);
            var userName = _context.Users.FirstOrDefault(u => u.Id == userId)!.UserName;

            await Clients.All.SendAsync("ReceiveAddRoomMessage", maxRoom, roomId, roomName, userId, userName);
        }

        public async Task SendDeleteRoomMessage(int deleted, int selected, string roomName)
        {
            var userId = Context.User!.FindFirstValue(ClaimTypes.NameIdentifier);
            var userName = _context.Users.FirstOrDefault(u => u.Id == userId)!.UserName;

            await Clients.All.SendAsync("ReceiveDeleteRoomMessage", deleted, selected, roomName, userName);
        }

        public async Task SendPublicMessage(int roomId, string message, string roomName)
        {
            var userId = Context.User!.FindFirstValue(ClaimTypes.NameIdentifier);
            var userName = _context.Users.FirstOrDefault(u => u.Id == userId)!.UserName;

            await Clients.All.SendAsync("ReceivePublicMessage", roomId, userId, userName, message, roomName);
        }
    }
}
