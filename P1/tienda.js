//-- Importar los modulos http, fs y url
const http = require('http');
const fs = require('fs');

//-- Definir el puerto a utilizar
const PUERTO = 9090;

//-- Mensaje de arranque
console.log("Arrancando servidor...");

//-- Crear el sevidor
const server = http.createServer(function (req, res) {

  //-- Indicar que se ha recibido una peticion
  console.log("Peticion Recibida");

  //-- Crear el objeto URL del mensaje de solitud (req)
  //-- y coger el recurso (url)
  const myURL = new URL(req.url, 'http://' + req.headers['host']);

  //-- Escribir en consola la ruta de nuestro recurso
  console.log("Recurso recibido: " + myURL.pathname);

  res.statusCode = 200;
  res.statusMessage = "OK :-)";
  res.setHeader('Content-Type', 'text/plain');
  //res.write("Soy el happy server\n");
  res.end()
  
 

  fs.readFile('/index.html', function(err, data){
    //-- Controlar si la pagina es no encontrada.
    //-- Devolver pagina de error personalizada, 404 NOT FOUND
  
      //-- Todo correcto
      //-- Mandar el mensaje 200 OK
      
      console.log("Peticion Atendida, 200 OK");
    });
    //-- Enviar los datos del fichero solicitado  

});

//-- Activar el servidor
server.listen(PUERTO);

//-- Mensaje de inicio
console.log("Escuchando en puerto: " + PUERTO);