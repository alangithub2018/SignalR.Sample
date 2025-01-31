// create connection to hub
const connection = new signalR.HubConnectionBuilder().withUrl("/hubs/userCount").build();

// connect to methods that hub invokes aka receive notifications from hub
connection.on("updateTotalViews", (totalViews) =>
{
    var newSpan = document.getElementById("totalViewsCounter");
    newSpan.innerText = totalViews.toString();
});

// invoke hub methods aka send notifications to hub
function newWindowLoadedOnClient() {
    connection.send("NewWindowLoaded");
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

// start connection
connection.start().then(fulfilled, rejected);