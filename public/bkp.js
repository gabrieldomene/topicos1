var websocket;
var servidorWebserver;
var idlogin = O('idlogin');
var idpass = O('idpass');
var dadosUser;
var toggle = O('ingame');
var btnLogin = O('btnLogin');
var peca = O('peca');
var board = boardClient();

btnLogin.addEventListener('click', function(){
    validaLogin();
});

function startConection(id){
    dadosUser = id;
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
        case 'USERS':
            listaAmigos(msgServer.valor); //mostra os usuarios no vetor conectados
            /* alert(msgServer.valor);*/
            break;
    }

}
servidorWebserver = 'ws://' + window.location.hostname + ':8080';


function O(msg){
    return document.getElementById(msg);
}
function validaLogin(){

    let dadosUser = {login:idlogin.value, pass:idpass.value};
    startConection(dadosUser);
    dadosUser = JSON.stringify(dadosUser);
    toggle.style.visibility = 'visible';
    
}   

var logUsers;
function listaAmigos(vetor){
    var container = document.getElementById('users-container');
    var aux = '';

    for(var i = 0; i < vetor.length; i++){
        if(!(vetor[i] === dadosUser.login)){
            aux += vetor[i]+"<input type='submit' value='Convite' class='convidar' onclick='convite()' id='"+vetor[i]+"'>"
        }
    }
    if (aux != logUsers){
        container.innerHTML = aux;
        logUsers = aux;
    }
}

let DESLOCAMENTO=50;
let x=DESLOCAMENTO;
function desenhaTabuleiro (ctx)
{
  let cor = "#f3f3f3";
  let T = 100;
  for (let linhas=0; linhas<8;linhas++)
  {
      if (cor=="#f3f3f3") cor = "#44423f";
       else cor = "#f3f3f3"
    for (let colunas=0; colunas <8; colunas++)
    {  
        /* ctx.globalCompositeOperation = 'source-over';  *///joga imagem na frente
        ctx.fillStyle=cor; //setando cor do quadrado
        ctx.fillRect(colunas*T+DESLOCAMENTO,linhas*T+DESLOCAMENTO,T,T); //(posx, posy, L, L)
       if (cor=="#f3f3f3") cor = "#44423f";
       else cor = "#f3f3f3"
    }
  }
  let tabuleiro = new Array(8)
}
window.onload = function() {
    var canvas = document.getElementById("myCanvas");
    var ctx = canvas.getContext("2d");
    var img = document.getElementById("peca");
    let st="ABCDEFGH";
    let st2="12345678"
     ctx.font = "15px Helvetica";
     for (let colunas=0;colunas<8;colunas++)
      ctx.fillText(st.charAt(colunas),colunas*100+2*DESLOCAMENTO,50); //charat pega a primeira letra de st
    for (let linhas=0;linhas<8;linhas++)
      ctx.fillText(st2.charAt(linhas),20,linhas*100+2*DESLOCAMENTO); 
      desenhaTabuleiro(ctx);
      for(let i =0; i<8; i++){
          for(let j = 0; j<2; j++){
                ctx.drawImage(img, x+(i*100), j*100+50);///desenha imagem no tabuleiro
                ctx.drawImage(img, x+i*100, j*100+50+100*6);
          }
      }
    setInterval(function(){
     /*    
        //ctx.clearRect(0,0,999,999);
       ctx.drawImage(img, x, 50);///desenha imagem no tabuleiro
       ctx.drawImage(img, x, 150);
       x=(x+100) % 800; */
    },2000);
    
};

function desenhaPeca(ctx, value, x, y){
    ctx.globalCompositeOperation = 'source-over';
    if(value != 0){
        ctx.fillText('A', T, T);
    }
}

function boardClient(){
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

function pintaTabuleiro(ctx) { //falta receber o tabuleiro NO MSG EVENT
  
    ctx.globalCompositeOperation ='source-over';
  
    for(var i = 0; i < 8; i++) {
          for(var j = 0; j < 8; j++) {
              desenhapeca(ctx, board[i][j], j, i);
          }
    }
  
    ctx.globalCompositeOperation ='destination-over';
  }

/* function pintaTabuleiro(ctx) {
  
    ctx.globalCompositeOperation ='source-over';
  
    for(var i = 0; i < 8; i++) {
          for(var j = 0; j < 8; j++) {
              desenhapeca(ctx, board[i][j], j, i);
          }
    }
  
    ctx.globalCompositeOperation ='destination-over';
}

pintaTabuleiro(ctx)

function desenhapeca(ctx, cod, x, y) {
    // onde na matriz estiver undefined, é que o espaço é vazio
    if(cod != 0) { // vazio significa undefined
      ctx.fillRect(img, T, T);
      
      //console.log("Desenhando em "+(-10 + x)+" "+(800/8 + y*800/8)+" o valor "+ cod);
    }
}
   */