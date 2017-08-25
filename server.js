// server.js

const express = require('express');
const SocketServer = require('ws').Server;
const uuid = require('uuid/v4')

// Set the port to 3001
const PORT = 3001;

// Create a new express server
const server = express()
   // Make the express server serve static assets (html, javascript, css) from the /public folder
  .use(express.static('public'))
  .listen(PORT, '0.0.0.0', 'localhost', () => console.log(`Listening on port ${ PORT }`));

// Create the WebSockets server
const wss = new SocketServer({ server });

let clients = {}

let clientCount = 0;

// Set up a callback that will run when a client connects to the server
// When a client connects they are assigned a socket, represented by
// the ws parameter in the callback.

function broadcast(data) {
  wss.clients.forEach(function each(client) {
    if (client.readyState === client.OPEN) {
     //if (client !== wss && client.readyState === client.OPEN) {
      client.send(data);
    }
  });
};

// function count(clients) {
//   wss.clients.forEach(function each(client) {
//     if (client.readyState === client.OPEN) {
//      //if (client !== wss && client.readyState === client.OPEN) {
//       clientCount++;
//     }
//   });
// };


wss.on('connection', (client) => {

  console.log('Client connected');

  clientCount++;

  // Initialize a new client id
  const clientId = uuid();

  //clientConnected(client, clientId);



  client.on('message', function incoming(data) {

    let type = JSON.parse(data).type

    console.log("this is server data: ", data)

    if (type === "postMessage") {

      clients = {
        type: "incomingMessage",
        id: clientId,
        count: clientCount,
        username: JSON.parse(data).username,
        content: JSON.parse(data).content
      }

      broadcast(JSON.stringify(clients))

    }

    else {

      //let someText = " has changed their name to "

      clients = {
        type: "incomingNotification",
        id: clientId,
        count: clientCount,
        username: JSON.parse(data).username,
        content: JSON.parse(data).content
      }

      broadcast(JSON.stringify(clients))

    }

    // console.log(clients)
    // console.log((JSON.parse(data).username) + " says " + (JSON.parse(data).content) )

    // broadcast(data);

  });



// wss.on('connection', function connection(ws) {
//   ws.on('message', function incoming(data) {
//     // Broadcast to everyone else.
//     wss.clients.forEach(function each(client) {
//       if (client !== ws && client.readyState === WebSocket.OPEN) {
//         client.send(data);
//       }
//     });
//   });
// });

  // Set up a callback for when a client closes the socket. This usually means they closed their browser.
    client.on('close', () => {
      console.log('Client disconnected');
      clientCount--;
    });

})


