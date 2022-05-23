//-- Cargar el módulo de electron
const electron = require('electron');

//-- Cargar las dependencias
const socket = require('socket.io');
const http = require('http');
const express = require('express');
const colors = require('colors');
const snakeNames = require('snake-names');
const ip = require('ip');

const PUERTO = 9090;

//-- Crear una nueva aplciacion web
const app = express();
//-- Crear un servidor, asosiaco a la App de express
const server = http.Server(app);
//-- Crear el servidor de websockets, asociado al servidor http
const io = socket(server);

let counter = 0;

//--Nuevo user
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

//-- Variable para acceder a la ventana principal
//-- Se pone aquí para que sea global al módulo principal
let win = null;
//-------- PUNTOS DE ENTRADA DE LA APLICACION WEB
//-- Definir el punto de entrada principal de mi aplicación web
app.get('/', (req, res) => {
  let path = __dirname + '/public/chat.html';
  res.sendFile(path);
  console.log("Acceso a " + path);
});
//-- Esto es necesario para que el servidor le envíe al cliente la
//-- biblioteca socket.io para el cliente
app.use('/', express.static(__dirname +'/'));
app.use(express.static('public'));

//------------------- GESTION SOCKETS IO
//-- Evento: Nueva conexion recibida
io.on('connect', (socket) => {
  console.log('** Nueva conexión **'.yellow + socket.id);
  counter = counter + 1;
  //-- Enviar numero de usuarios al renderer
  win.webContents.send('users', counter);
   socket.id =  snakeNames.random() ;
   socket.send('Bienvenido' + "  " + socket.id + "!" );
   win.webContents.send('msg_client', '<b> Bienvenido! </b>' + socket.id + "!" );
  
     //-- Enviar mensaje de nuevo usuario a todos los usuarios
  io.send( socket.id  + "</i> " +'se unió. ');

  //-- Enviar al render mensaje de conexion
  win.webContents.send('msg_client', + socket.id  + "</i> " +'se unió. ');


  //-- Evento de desconexión
  socket.on('disconnect', function(){
    io.send("El usuario se ha ido del chat")
    console.log('** Conexión terminada **'.yellow);
    counter = counter - 1;
    win.webContents.send('users', counter);

        //-- Enviar mensaje de desconexión de usuario a todos los usuarios
        io.send(  socket.id  + " </i> " + 'abandonó el chat. ');

        //-- Enviar al render mensaje de desconexion
        win.webContents.send('msg_client', +  socket.id  + " </i> " + 'abandonó el chat. ');
  });  

  //-- Mensaje recibido: Reenviarlo a todos los clientes conectados
  socket.on("message", (msg)=> {
     //-- Enviar al render
     win.webContents.send('msg_client', socket.id + ': '  + msg);
    //-- Se recibe peticion de comando
    if (msg.startsWith('/')){
      if (msg == '/help'){
        socket.send("Comandos: <br>" +
                ">> <b>/help --> Visualización los comandos existentes<br>" +
                ">> <b>/list --> Visualización del número de usuarios conectados<br>" +
                ">> <b>/hello --> El servidor devuelve un saludo<br>" +
                ">> <b>'/date --> Visualización de la fecha actual<br>");
        console.log('/help');

      } else if (msg == '/list'){
          socket.send(">> Número de usuarios conectados: " + counter);

      } else if (msg == '/hello'){
          socket.send(">> Hello");

      } else if (msg == "/date"){
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

console.log("Arrancando electron...");

//-- Punto de entrada. En cuanto electron está listo,
//-- ejecuta esta función
electron.app.on('ready', () => {
    console.log("Evento Ready!");

    //-- Crear la ventana principal de nuestra aplicación
    win = new electron.BrowserWindow({
        width: 1000,   //-- Anchura 
        height: 850,  //-- Altura

        //-- Permitir que la ventana tenga ACCESO AL SISTEMA
        webPreferences: {
          nodeIntegration: true,
          contextIsolation: false
        }
    });

  //-- En la parte superior se nos ha creado el menu
  //-- por defecto
  //-- Si lo queremos quitar, hay que añadir esta línea
  //win.setMenuBarVisibility(false)

  //-- Cargar contenido web en la ventana
  //-- La ventana es en realidad.... ¡un navegador!
  //win.loadURL('https://www.urjc.es/etsit');

  //-- Cargar interfaz gráfica en HTML
  win.loadFile("index.html");

  //-- Esperar a que la página se cargue y se muestre
  //-- y luego enviar el mensaje al proceso de renderizado para que 
  //-- lo saque por la interfaz gráfica
  win.on('ready-to-show', () => {
    win.webContents.send('ip', 'http://' + ip.address() + ':' + PUERTO);
  });
});
//-- Esperar a recibir los mensajes de botón apretado (Test) del proceso de 
//-- renderizado. Al recibirlos se escribe una cadena en la consola
electron.ipcMain.handle('test', (event, msg) => {
  console.log("Mensaje: " + msg);
  io.send(msg);
  win.webContents.send('msg', msg);
});

