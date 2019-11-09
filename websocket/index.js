/**************************websocket_example.js*************************************************/

var bodyParser = require("body-parser");
const express = require('express'); //express framework to have a higher level of methods
const app = express(); //assign app variable the express class/method
var http = require('http');
var path = require("path");
app.use(bodyParser.urlencoded({ extended: false }));
const url = require('url');
app.use(bodyParser.json());
const server = http.createServer(app);//create a server


//***************this snippet gets the local ip of the node.js server. copy this ip to the client side code and add ':3000' *****
//****************exmpl. 192.168.56.1---> var sock =new WebSocket("ws://192.168.56.1:3000");*************************************
require('dns').lookup(require('os').hostname(), function (err, add, fam) {
  console.log('addr: '+add);
})

/**********************websocket setup**************************************************************************************/
//var expressWs = require('express-ws')(app,server);
const WebSocket = require('ws');


const wss1 = new WebSocket.Server({ noServer: true });
const wss2 = new WebSocket.Server({ noServer: true });
 
wss1.on('connection', function connection(ws) {
  // ...
  console.log("HKSJDLAS");

/******* when server receives messsage from client trigger function with argument message *****/
ws.on('message',function(message){
console.log("Received: "+message);
wss1.clients.forEach(function(client){ //broadcast incoming message to all clients (s.clients)
if(client!=ws && client.readyState ){ //except to the same client (ws) that sent this message
client.send("broadcast: " +message);
}
});
// ws.send("From Server only to sender: "+ message); //send to client where message is from
});
ws.on('close', function(){
console.log("lost one client");
});
//ws.send("new client connected");
console.log("new client connected");


});
 
wss2.on('connection', function connection(ws) {

  console.log('HENLO');

ws.on('message',function(message){
  console.log('GOT HTE MESSAGE');
  
})

});


 
server.on('upgrade', function upgrade(request, socket, head) {
  const pathname = url.parse(request.url).pathname;
 
  if (pathname === '/') {
    wss1.handleUpgrade(request, socket, head, function done(ws) {
      wss1.emit('connection', ws, request);
    });
  } else if (pathname === '/about') {
    wss2.handleUpgrade(request, socket, head, function done(ws) {
      wss2.emit('connection', ws, request);
    });
  } else {
    socket.destroy();
  }
});
 


//when browser sends get request, send html file to browser
// viewed at http://localhost:30000
app.get('/', function(req, res) {
res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/about', function(req, res) {
  res.sendFile(path.join(__dirname + '/about.html'));
  });


//*************************************************************************************************************************
//***************************ws chat server********************************************************************************




server.listen(3000);



