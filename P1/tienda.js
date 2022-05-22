//-- Importar los modulos http, fs y url
const http = require('http');
const fs = require('fs');
const url = require('url');

//-- Definir el puerto a utilizar
const PUERTO = 9090;

//-- definir tipos de mime

let mime = {
  '/'    : 'text/html',
  'html' : 'text/html',
  'css'  : 'text/css',
  'jpg'  : 'image/jpg',
  'js'   : 'text/js',
  'png'  : 'image/png',
  'gif'  : 'image/gif',

};

//-- Crear el sevidor
const server = http.createServer(function (req, res) {

  //-- Indicar que se ha recibido una peticion
  console.log("Peticion Recibida");

  //-- Crear el objeto URL del mensaje de solitud (req)
  //-- y coger el recurso (url)
  let myURL = new URL(req.url, 'http://' + req.headers['host']);

  //-- Escribir en consola la ruta de nuestro recurso
  console.log("Recurso recibido: " + myURL.pathname);

    //buscar el archivo 
  if(myUrl.pathname == '/'){
    filename += "/tienda.html";
  }else{
      filename += "." + myUrl.pathname;
  }

  console.log("Filename:",filename);


  let recurso = myUrl.pathname.lastIndexOf(".");
  let content_type = myUrl.pathname.slice(recurso + 1);  
 

  fs.readFile('/index.html', function(err, data){
    //-- Controlar si la pagina es no encontrada.
    //-- Devolver pagina de error personalizada, 404 NOT FOUND
  
      //si hay error
      if (err) {           
        data = fs.readFileSync('/error.html')
        res.writeHead(404, {'Content-Type': 'text/html'});
        res.write(data);
        res.end();
        
    }else{
        res.writeHead(200, {'Content-Type': mime[content_type]});
        res.write(data);
        res.end();
        console.log("Peticion Atendida, 200 OK");
    }
      
    });
    //-- Enviar los datos del fichero solicitado  

});

//-- Activar el servidor
server.listen(PUERTO);

//-- Mensaje de inicio
console.log("Escuchando en puerto: " + PUERTO);