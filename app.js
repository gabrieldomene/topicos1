var http = require('http'),
    express = require('express'),
    url = require('url'),
    path = require('path'),
    fs = require('fs'),
    path = require('path'),
    mongodb = require('mongodb'),
    bodyParser = require('body-parser'),
    WebSocket = require('ws');

var urlencodedParser = bodyParser.urlencoded({extended:false});
var MongoClient = require('mongodb').MongoClient;
var urldb = 'mongodb://localhost:27017/';

var app = express();

var vetorClientes = [];

const wss = new WebSocket.Server({ port: 8080 },function (){
    console.log('SERVIDOR WEBSOCKETS na porta 8080');
});

function fazBroadcast (msg)
{
  for (let x=0;x<vetorClientes.length;x++)
            {
              try {
                if (vetorClientes[x].validado==true)
                  vetorClientes[x].send(JSON.stringify(msg)); 
              }
              catch (e)
              {

              }
            }
}
//ATUALIZA lista
function atualizaLista(){
    var temp = [];

    for(var i=0; i < vetorClientes.length;i++){
        temp[i].push(vetorClientes[i].nome);
    }

    let MSG = {tipo:'USERS', valor:temp}

    fazBroadcast(MSG);

}
//CONFIG WEBSOCKET

wss.on('connection', function connection(ws){
    ws.validado = false;
    ws.timestamp = Date.now();
    vetorClientes.push(ws);
    console.log('Cliente conectado')

    ws.on('close', function close(){
        console.log('cliente desconectou'); //conexao cliente encerrada
    });

    ws.on('message', function incoming(MSG){
        MSG  = JSON.parse(MSG);
        if(MSG.tipo == 'LOGIN'){
            console.log('Login: ');
            console.log('ID= ' + MSG.valor.login + ' PASS= ' + MSG.valor.pass);
            ws.nome = MSG.valor.username;
            ws.validado = true;
        }
    
        
    });
});


app.use(express.static(__dirname + '/public'));

app.post('/login', urlencodedParser, function(req, res){
    // username = req.body.username;
    // password = req.body.password;
    // usercorreto = 'luanrodrigues'
    // //perguntar pro fábio da conexao por req
    // //tentar jogar no localstorage e verificar
    // if(username == usercorreto){
    //     res.write('logou');
        
    //     res.sendFile(__dirname + '/public/login.html'); //me joga para o novo login
    // }else{
    //     res.sendFile(__dirname + '/public/index.html');
    // }
});


app.post('/cadastrar', urlencodedParser, function(req, res){//recebe o body da req
    // username = req.body.username;
    // password = req.body.password;
    // MongoClient.connect(urldb, function(err, db){
    //     var dbo = db.db('Xadrez');
    //     var myobj = {_id: username, password: password};
    //     if(dbo.collection('Users').find({_id: username}).toArray(function(err, result){
    //         if (err) throw err;
    //         result = 1;
    //     }) == 1){
    //         console.log('Usuário JÁ inserido');
            
    //     }else{
    //         dbo.collection('Users').insertOne(myobj, function(err, res){
    //             if (err) throw err
    //             console.log('1 usuário inserido'); 
    //             db.close();
    //         });
    //     }
    // });  
    // res.end();
});

app.listen(3000, function(){
    console.log('Server running on 3000');
});
