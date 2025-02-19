﻿// create connection to hub
const connection = new signalR.HubConnectionBuilder()
    //.configureLogging(signalR.LogLevel.Information)
    .withAutomaticReconnect()
    .withUrl("/hubs/userCount", signalR.HttpTransportType.WebSockets).build();

// connect to methods that hub invokes aka receive notifications from hub
connection.on("updateTotalViews", (totalViews) =>
{
    var newSpan = document.getElementById("totalViewsCounter");
    newSpan.innerText = totalViews.toString();
});

connection.on("updateTotalUsers", (totalUsers) => {
    var newCountSpan = document.getElementById("totalUsersCounter");
    newCountSpan.innerText = totalUsers.toString();
});

// invoke hub methods aka send notifications to hub
function newWindowLoadedOnClient() {
    // See the difference between using send and invoke
    // Send is not expecting a returned value by the server
    //connection.send("NewWindowLoaded");
    // Invoke is expecting a value returned by the server
    connection.invoke("NewWindowLoaded", "MyNewArgumentSent").then((value) => console.log(value));
}

function fulfilled() {
    // do something on start
    console.log("Connection to User Hub Successful");
    newWindowLoadedOnClient();
}

function rejected() {
    // do something on error
    console.log("Connection to User Hub Failed");
}

connection.onclose((error) => {
    document.body.style.background = "red";
});

connection.onreconnected((connectionId) => {
    document.body.style.background = "green";
});

connection.onreconnecting((error) => {
    document.body.style.background = "orange";
});

// start connection
connection.start().then(fulfilled, rejected);