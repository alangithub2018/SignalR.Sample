using Microsoft.AspNetCore.SignalR;

namespace SignalR.Sample.Hubs
{
    public class HouseGroupHub : Hub
    {
        public static List<string> GroupsJoined { get; set; } = [];

        public async Task JoinHouse(string houseName)
        {
            var connectionId = Context.ConnectionId;
            var keyConnection = connectionId + ":" + houseName;
            if (!GroupsJoined.Contains(keyConnection))
            {
                GroupsJoined.Add(keyConnection);

                string houseList = "";
                foreach (var str in GroupsJoined)
                {
                    if (str.Contains(Context.ConnectionId))
                    {
                        houseList += str.Split(':')[1] + " ";
                    }
                }

                await Clients.Caller.SendAsync("subscriptionStatus", houseList, houseName.ToLower(), true);
                await Clients.Others.SendAsync("newMemberAddedToHouse", houseName);
                await Groups.AddToGroupAsync(connectionId, houseName);
            }
        }

        public async Task LeaveHouse(string houseName)
        {
            var connectionId = Context.ConnectionId;
            var keyConnection = connectionId + ":" + houseName;
            if (GroupsJoined.Contains(keyConnection))
            {
                GroupsJoined.Remove(keyConnection);

                string houseList = "";
                foreach (var str in GroupsJoined)
                {
                    if (str.Contains(Context.ConnectionId))
                    {
                        houseList += str.Split(':')[1] + " ";
                    }
                }

                await Clients.Caller.SendAsync("subscriptionStatus", houseList, houseName.ToLower(), false);
                await Clients.Others.SendAsync("newMemberRemovedFromHouse", houseName);
                await Groups.RemoveFromGroupAsync(connectionId, houseName);
            }
        }

        public async Task TriggerHouseNotify(string houseName)
        {
            await Clients.Group(houseName).SendAsync("triggerHouseNotification", houseName);
        }
    }
}
