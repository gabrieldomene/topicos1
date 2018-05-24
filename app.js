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
const TIMEOUT = 10000;

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
function criaTabuleiro(){
    let board = new Array(8);
    for(var i = 0; i < 8; i++) {
        board[i] = new Array(8);
    }
    for(let i = 0; i<8; i++){
        for(let j = 0; j<8; j++){
            if(i<2){
                board[i][j] = 1; //seta player de cima;
            }
            else if(i>=2 && i<6){
                board[i][j] = 0; //parte livre
            }else{
                board[i][j] = 2; //player 2
            }
        }
    }
    return board
}
board = criaTabuleiro();

function PERIODICA ()
{
  let agora = Date.now();

  let x=0;
  while (x < vetorClientes.length)
  {
    if ((vetorClientes[x].validado==false) && ((agora - vetorClientes[x].timestamp) > TIMEOUT ) )
    {
        console.log('remove usuario da lista de ativos')
        let MSG = {tipo:'ERRO',valor:'timeout'};
        vetorClientes[x].send(JSON.stringify(MSG));
        vetorClientes[x].close();
        vetorClientes.splice(x, 1);
        atualizaUsers();
    }
    else x++;

  }
}

//ATUALIZA lista
function atualizaUsers(){
    var temp = [];

    for(var i=0; i < vetorClientes.length;i++){
        if(vetorClientes[i].validado = true){
            temp.push(vetorClientes[i].nome);
        }
    }

    let MSG = {tipo:'USERS', valor:temp}
    console.log('Usuarios no vetor ws.nome: ' + temp);

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
            ws.nome = MSG.valor.login;
            ws.validado = true;
            fazBroadcast(MSG);
            atualizaUsers();
        }
    });
});


app.use(express.static(__dirname + '/public'));

app.post('/login', urlencodedParser, function(req, res){
    // username = req.body.username;
    // password = req.body.password;
    // usercorreto = 'luanbrodrigues'
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
setInterval (PERIODICA,10000);
console.log(board)

