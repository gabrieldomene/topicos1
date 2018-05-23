var websocket;
var servidorWebserver;
var idlogin = O('idlogin');
var idpass = O('idpass');
var dadosUser;

function startConection(id){
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
        valor: dadosUser
    };
    websocket.send(JSON.stringify(MSG));
}
function onClose(evt){
    console.log('onClose');
}
function onMessage(evt){
    var msgServer = JSON.parse(evt.data);

    switch(msgServer.tipo){
        case 'USERS'
            listaAmigos(msgServer.valor);
            break;
    }

}
servidorWebserver = 'ws://' + window.location.hostname + ':8080';


function O(msg){
    return document.getElementById(msg);
}
function validaLogin(){
    startConection(dadosUser);
    dadosUser = {login:idlogin.value, pass:idpass.value};
    
}

function listaAmigos(vetor){
    var container = document.getElementById('users-container');
    var aux = '';

    for(var i = 0; i < vetor.length; i++){
        if(!(vetor[i] === dadosUser.login)){
            aux += vetor[i]+"<input type='submit' class='convidar' onclick='convite()' id='"+vetor[i]+"'>"
        }
    }
    if (aux != logUsers){
        container.innerHTML = aux;
        logUsers = aux;
    }
}
