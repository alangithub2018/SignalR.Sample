namespace SignalR.Sample.Models.ViewModel
{
    public class ChatVM
    {
        public ChatVM()
        {
            Rooms = new List<ChatRoom>();
        }

        public IList<ChatRoom> Rooms { get; set; }

        public int MaxRoomAllowed { get; set; }

        public string? UserId { get; set; }

        public bool AllowAddRoom => Rooms == null || Rooms.Count < MaxRoomAllowed;
    }
}
