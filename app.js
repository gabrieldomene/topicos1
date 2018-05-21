var http = require('http'),
    express = require('express'),
    url = require('url'),
    fs = require('fs'),
    path = require('path'),
    WebSocket = require('ws');

var app = express();

var wss = new WebSocket.Server({ port: 8080 },function (){
    console.log('SERVIDOR WEBSOCKETS na porta 8080');
});

app.use(express.static(__dirname + '/public'));

app.post('/login', function(req, res){
    res.sendFile(__dirname + '/public/login.html'); //me joga para o novo login
})

app.listen(3000, function(){
    console.log('Server running on 3000');
});
