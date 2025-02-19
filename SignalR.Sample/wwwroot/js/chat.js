﻿
var advancedChatConnection = new signalR.HubConnectionBuilder()
    .withUrl("/hubs/chat")
    .withAutomaticReconnect([0, 1000, 5000, null])
    .build();

advancedChatConnection.on("ReceiveUserConnected", function (userId, userName) {
    addMessage(`${userName} has a connection open`);    
});

advancedChatConnection.on("ReceiveUserDisconnected", function (userId, userName) {
    addMessage(`${userName} has closed a connection`);
});

advancedChatConnection.on("ReceiveAddRoomMessage", function (maxRoom, roomId, roomName, userId, userName) {
    addMessage(`${userName} has created room ${roomName}`);
    fillRoomDropDown();
});

advancedChatConnection.on("ReceiveDeleteRoomMessage", function (deleted, selected, roomName, userName) {
    addMessage(`${userName} has deleted room ${roomName}`);
    fillRoomDropDown();
});

advancedChatConnection.on("ReceivePublicMessage", function (roomId, userId, userName, message, roomName) {
    addMessage(`[Public message - ${roomName}] ${userName} says ${message}`);
});

advancedChatConnection.on("ReceivePrivateMessage", function (senderId, senderName, receiverId, message, chatId, receiverName) {
    addMessage(`[Private message to ${receiverName}] ${senderName} says ${message}`);
});

function sendPublicMessage() {
    let inputMsg = document.getElementById("txtPublicMessage");
    let ddlSelRoom = document.getElementById("ddlSelRoom");

    let roomId = ddlSelRoom.value;
    let roomName = ddlSelRoom.options[ddlSelRoom.selectedIndex].text;

    var message = inputMsg.value;
    advancedChatConnection.send("SendPublicMessage", Number(roomId), message, roomName);
    inputMsg.value = '';
}

function sendPrivateMessage() {
    let inputMsg = document.getElementById("txtPrivateMessage");
    let ddlSelUser = document.getElementById("ddlSelUser");

    let receiverId = ddlSelUser.value;
    let receiverName = ddlSelUser.options[ddlSelUser.selectedIndex].text;

    var message = inputMsg.value;
    advancedChatConnection.send("SendPrivateMessage", receiverId, message, receiverName);
    inputMsg.value = '';
}

function deleteRoom() {
    let ddlDelRoom = document.getElementById("ddlDelRoom");
    // Get the roomName
    var roomName = ddlDelRoom.options[ddlDelRoom.selectedIndex].text;

    // display a confirmation
    let text = `Are you sure to delete room ${roomName}?`;
    if (confirm(text) == false) {
        return;
    }

    if (roomName == null && roomName == '') {
        return;
    }

    let roomId = ddlDelRoom.value;

    /*POST*/
    $.ajax({
        url: `/ChatRooms/DeleteChatRoom/${roomId}`,
        dataType: "json",
        type: "DELETE",
        contentType: 'application/json;',
        async: true,
        processData: false,
        cache: false,
        success: function (json) {

            /*REMOVE ROOM COMPLETED SUCCESSFULLY*/
            advancedChatConnection.send("SendDeleteRoomMessage", json.deleted, json.selected, roomName);
            fillRoomDropDown();
        },
        error: function (xhr) {
            alert('error');
        }
    })
}

function addnewRoom(maxRoom) {

    let createRoomName = document.getElementById('createRoomName');

    var roomName = createRoomName.value;

    if (roomName == null && roomName == '') {
        return;
    }

    /*POST*/
    $.ajax({
        url: '/ChatRooms/PostChatRoom',
        dataType: "json",
        type: "POST",
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify({ id: 0, name: roomName }),
        async: true,
        processData: false,
        cache: false,
        success: function (json) {

            /*ADD ROOM COMPLETED SUCCESSFULLY*/
            advancedChatConnection.send("SendAddRoomMessage", maxRoom, json.id, json.name);
            createRoomName.value = '';


        },
        error: function (xhr) {
            alert('error');
        }
    })
}

document.addEventListener('DOMContentLoaded', (event) => {
    fillRoomDropDown();
    fillUserDropDown();
})

function fillUserDropDown() {

    $.getJSON('/ChatRooms/GetChatUser')
        .done(function (json) {

            var ddlSelUser = document.getElementById("ddlSelUser");

            ddlSelUser.innerText = null;

            json.forEach(function (item) {
                var newOption = document.createElement("option");

                newOption.text = item.userName;//item.whateverProperty
                newOption.value = item.id;
                ddlSelUser.add(newOption);


            });

        })
        .fail(function (jqxhr, textStatus, error) {

            var err = textStatus + ", " + error;
            console.log("Request Failed: " + jqxhr.detail);
        });
}

function fillRoomDropDown() {

    $.getJSON('/ChatRooms/GetChatRoom')
        .done(function (json) {
            var ddlDelRoom = document.getElementById("ddlDelRoom");
            var ddlSelRoom = document.getElementById("ddlSelRoom");

            ddlDelRoom.innerText = null;
            ddlSelRoom.innerText = null;

            json.forEach(function (item) {
                var newOption = document.createElement("option");

                newOption.text = item.name;
                newOption.value = item.id;
                ddlDelRoom.add(newOption);


                var newOption1 = document.createElement("option");

                newOption1.text = item.name;
                newOption1.value = item.id;
                ddlSelRoom.add(newOption1);

            });

        })
        .fail(function (jqxhr, textStatus, error) {

            var err = textStatus + ", " + error;
            console.log("Request Failed: " + jqxhr.detail);
        });
}

function addMessage(msg) {
    if (msg == null && msg == '') {
        return;
    }
    let ui = document.getElementById("messagesList");
    let li = document.createElement("li");
    li.innerHTML = msg;
    ui.appendChild(li);
}

advancedChatConnection.start();