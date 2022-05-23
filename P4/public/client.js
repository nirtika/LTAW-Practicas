//-- Elementos del interfaz
const display_msg = document.getElementById("display_msg");
const message = document.getElementById("message");
const sound = document.getElementById("sound");
const nick = document.getElementById("nick");


//-- Crear un websocket. Se establece la conexión con el servidor
const socket = io();

//-- Introducción de nickname 
let nickname = 'Unknown' ;

//-- Usuario esta escribiendo
let writing = false;

//-- Asignación de nickname
nick.onchange = () => {
  if(nick.value){
    nickname = nick.value;
    console.log('Nick' + nickname);
  }
}

socket.on("message", (msg)=>{
  display_msg.innerHTML += '<p>' + msg + '</p>';

  //-- Sonido al recibir mensaje 
  if (!msg.includes("escribiendo...")){  
    sound.play();
  }
});

//-- Al apretar el botón se envía un mensaje al servidor
message.onchange = () => {
  if (message.value){
    writing = false;
    socket.send(nickname + ': ' + message.value);
  }

  //-- Borrar el mensaje actual
  message.value = "";
}

//-- Mensaje escribiendo...
message.oninput = () => {
  if(!writing){
    writing = true;
    socket.send('El usuario ' + nickname + ' esta escribiendo...');
  };
};