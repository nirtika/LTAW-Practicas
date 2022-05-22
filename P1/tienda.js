//-- Importar los modulos http, fs y url
const http = require('http');
const fs = require('fs');

//-- Definir el puerto a utilizar
const PUERTO = 9090;

//-- definir tipos de mime

const mime = {
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
  let url = new URL(req.url, 'http://' + req.headers['host']);

  //-- Escribir en consola la ruta de nuestro recurso
  console.log("Recurso recibido: " + url.href);

  let filename="";
    //buscar el archivo 
  if(url.pathname == '/'){
    filename += "/index.html";
  }else{
    filename +=  url.pathname;
  }

  console.log("Filename:",filename);
 
  content_type = filename.split(".")[1]; 
  filename = "."+ filename

  let mime_type = mime[content_type];  // tipo de mime


  fs.readFile(filename, function(err, data){
    //-- Controlar si la pagina es no encontrada.
    //-- Devolver pagina de error personalizada, 404 NOT FOUND
  
      //si hay error
      if (err) {           
        data = fs.readFileSync('error.html')
        res.writeHead(404, {'Content-Type': 'text/html'});
        res.end();
        
    }else{
        res.writeHead(200, {'Content-Type': mime_type});
        console.log("Peticion Atendida, 200 OK");
    }
      
    });
    //-- Enviar los datos del fichero solicitado  

});

//-- Activar el servidor
server.listen(PUERTO);

//-- Mensaje de inicio
console.log("Escuchando en puerto: " + PUERTO);