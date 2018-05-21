var login = O('idlogin');
var password = O('idpass');
var websocket;
var servidorWebserver;
var meuID;

function startConection(id){
    meuID = id;
    websocket = new ReconnectingWebSocket(servidorWebserver);
    websocket.onopen = function(evt){
        onOpen(evt)
    }
    websocket.onclose = function(evt){
        onClose(evt)
    }
    websocket.onmessage = function(evt){
        onMessage(evt)
    }
}
function onOpen(evt){
    console.log('onOpen')
    let MSG = {
        tipo: 'LOGIN',
        valor: meuID
    };
    websocket.send(JSON.stringify(MSG))
}
function onClose(evt){
    console.log('onClose');
}
function onMessage(evt){
    var msg = evt.data;
    msg = JSON.parse(msg);
    switch(msg.tipo){
        case 'ERRO':
            alert(msg.valor);
                websocket.close(0);
            break;
    }
    console.log('Recebeu msg');
}
servidorWebserver = 'ws://' + window.location.hostname + ':8080';

function O(msg){
    return document.getElementById(msg);
}
function validaLogin(){
    var dadosUser = {login:idlogin.value, pass:password.value};
    console.log(dadosUser);
}
