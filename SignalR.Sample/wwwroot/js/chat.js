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

    chatConnection.send("SendMessageToAll", sender, message).catch(function (error) {
        return console.error(error.toString());
    });

    event.preventDefault();
});

chatConnection.start().then(function () {
    document.getElementById("sendMessage").disabled = false;
});