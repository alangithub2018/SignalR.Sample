var chatConnection = new signalR.HubConnectionBuilder().withUrl("/hubs/chat").build();

document.getElementById("sendMessage").disabled = true;

chatConnection.on("MessageReceived", function (user, message) {
    var li = document.createElement("li");
    document.getElementById("messagesList").appendChild(li);
    li.textContent = `${user} - ${message}`;
});

document.getElementById("sendMessage").addEventListener("click", function (event) {
    var sender = document.getElementById("senderEmail").value;
    var message = document.getElementById("chatMessage").value;
    var receiver = document.getElementById("receiverEmail").value;

    if (receiver.length > 0) {
        chatConnection.send("SendMessageToReceiver", sender, receiver, message);
    } else {
        chatConnection.send("SendMessageToAll", sender, message).catch(function (error) {
            return console.error(error.toString());
        });
    }

    event.preventDefault();
});

chatConnection.start().then(function () {
    document.getElementById("sendMessage").disabled = false;
});