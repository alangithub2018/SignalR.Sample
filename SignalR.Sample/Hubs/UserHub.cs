using Microsoft.AspNetCore.SignalR;

namespace SignalR.Sample.Hubs
{
    public class UserHub : Hub
    {
        public static int TotalViews { get; set; }

        public async Task NewWindowLoaded()
        {
            TotalViews++;
            // send the new total to all clients
            await Clients.All.SendAsync("updateTotalViews", TotalViews);
        }
    }
}
