//-- Cargar las dependencias
const socket = require('socket.io');
const http = require('http');
const express = require('express');
const colors = require('colors');
const fs = require('fs');


const PUERTO = 9090;

//-- Crear una nueva aplicacion web
const app = express();

//-- Crear un servidor
const server = http.Server(app);

//-- Crear el servidor de websockets
const io = socket(server);

//-- Contador
var counter = 0;

//--Nuevo usuario
var new_user = false;

function date(){
  var fecha = new Date();
  var d = fecha.getDate();
  var m = fecha.getMonth()+1;
  var y = fecha.getFullYear();
  var h = fecha.getHours();
  var m = fecha.getMinutes();
  var s = fecha.getSeconds();
  return  'Fecha:' + d + '/' + m + '/' + y + 'Hora:' + h + ':' + m + ':' + s ;
}

// PUNTOS DE ENTRADA DE LA APLICACION WEB
//-- Definir el punto de entrada principal de mi aplicación web
app.get('/', (req, res) => {
  //
  path = __dirname + '/chat.html';
  res.sendFile(path);
  console.log("Acceso a" + path)
});

//-- Esto es necesario para que el servidor le envíe al cliente la
//-- biblioteca socket.io para el cliente
app.use('/', express.static(__dirname + '/'));

//-- El directorio publico contiene ficheros estáticos
app.use(express.static('public'));

//------------------- GESTION SOCKETS IO
//-- Evento: Nueva conexion recibida
io.on('connect', (socket) => {
  new_user = true;
  if (new_user == true){
    io.send("Nuevo usuario se ha unido al chat");
    socket.send("Bienvenido al MiniChat");
    new_user = false;
  }
  console.log('** Nueva conexión **'.yellow);
  counter = counter + 1;

  //-- Evento de desconexión
  socket.on('disconnect', function(){
    io.send("El usuario se ha ido del chat")
    console.log('** Conexión terminada **'.yellow);
    counter = counter - 1;
  });  

  //-- Mensaje recibido: Reenviarlo a todos los clientes conectados
  socket.on("message", (msg)=> {
    //-- Eliminamos el nick
    realMsg = msg.split(' ')[1];

    //-- Se recibe peticion de comando
    if (realMsg.startsWith('/')){
      if (realMsg == '/help'){
        socket.send("Comandos: <br>" +
                ">> <b>/help --> Visualización los comandos existentes<br>" +
                ">> <b>/list --> Visualización del número de usuarios conectados<br>" +
                ">> <b>/hello --> El servidor devuelve un saludo<br>" +
                ">> <b>'/date --> Visualización de la fecha actual<br>");
        console.log('/help');

      } else if (realMsg == '/list'){
          socket.send(">> Número de usuarios conectados: " + counter);

      } else if (realMsg == '/hello'){
          socket.send(">> Hello");

      } else if (realMsg == "/date"){
          socket.send('>> Hoy es: '+ date());
          console.log('/date');

      } else{
        socket.send('>> Comando incorrecto');
      }

    } else {
      //-- Mensaje normal, se reenvia a todos los clientes conectados
      io.send(msg);
    }

  });

});

//-- Lanzar el servidor HTTP
//-- ¡Que empiecen los juegos de los WebSockets!
server.listen(PUERTO);
console.log("Escuchando en puerto: " + PUERTO);