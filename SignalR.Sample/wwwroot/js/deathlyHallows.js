var cloakSpan = document.getElementById("cloakCounter");
var stoneSpan = document.getElementById("stoneCounter");
var wandSpan = document.getElementById("wandCounter");

// create connection to hub
const connectionDeathlyHallows = new signalR.HubConnectionBuilder()
    //.configureLogging(signalR.LogLevel.Information)
    .withUrl("/hubs/deathlyhallows").build();

// connect to methods that hub invokes aka receive notifications from hub
connectionDeathlyHallows.on("updateDeathlyHallowsCount", (cloak, stone, wand) =>
{
    cloakSpan.innerText = cloak.toString();
    stoneSpan.innerText = stone.toString();
    wandSpan.innerText = wand.toString();
});

function fulfilled() {
    connectionDeathlyHallows.invoke("GetRaceStatus").then((dh) =>
    {
        cloakSpan.innerText = dh.cloak.toString();
        stoneSpan.innerText = dh.stone.toString();
        wandSpan.innerText = dh.wand.toString();
    });
    // do something on start
    console.log("Connection to DeathlyHallows Hub Successful");
}

function rejected() {
    // do something on error
}

// start connection
connectionDeathlyHallows.start().then(fulfilled, rejected);