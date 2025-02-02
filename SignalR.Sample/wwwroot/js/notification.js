﻿var notificationConnection = new signalR.HubConnectionBuilder()
    .withUrl("/hubs/notification").build();

document.getElementById("sendButton").disabled = true;

notificationConnection.on("LoadNotification", function (message, counter) {
    document.getElementById("messageList").innerHTML = "";
    var notificationCounter = document.getElementById("notificationCounter");
    notificationCounter.innerHTML = "<span>(" + counter + ")</span>";
    for (let i = message.length - 1; i >= 0; i--) {
        var li = document.createElement("li");
        li.textContent = "Notification - " + message[i];
        document.getElementById("messageList").appendChild(li);
    }
})

document.getElementById("sendButton").addEventListener("click", function (event) {
    var message = document.getElementById("notificationInput").value;
    notificationConnection.send("SendMessage", message).then(function () {
        document.getElementById("notificationInput").value = "";
    });
    event.preventDefault();
});

notificationConnection.start().then(function () {
    notificationConnection.send("LoadMessages");
    document.getElementById("sendButton").disabled = false;
});