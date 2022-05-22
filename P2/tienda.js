//-- Importar los modulos http, fs y url
const http = require('http');
const fs = require('fs');

//-- Definir el puerto a utilizar
const PUERTO = 9090;

//-- definir tipos de mime

const mime = {
    "html" : "text/html",
    "css" : "text/css",
    "jpeg" : "image/jpeg",
    "jpg" : "image/jpg",
    "png" : "image/png",
    "gif" : "image/gif",
    "ico" : "image/ico",
    "js"   : "application/javascript",
    "json": "application/json"

};

  // base de datos

  const datos_base = "tienda.json";
  const data_tienda = fs.readFileSync("tienda.json"); //-- tienda.json
  const productos = tienda[0].parse(data_tienda); //-- base de datos
  const pedido = tienda[0].productos //-- lista de productos
  const pedido_final = data_tienda[2]['Finalizar']
  

  // usuario y contraseña
  let nombre=[];
  let passwords=[];

  // leer y guaradr en base de datos

  data_tienda[1]["usuarios"].forEach((element, index)=>{
    console.log("Usuario " + (index + 1) + ": " + element.usuario);
    nombre.push(element.usuario);
    passwords.push(element.password)
  });

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
        
        
    }else{
        res.writeHead(200, {'Content-Type': mime_type});
        console.log("Peticion Atendida, 200 OK");
        
    }

    res.write(data);
    res.end();
    });

});

//-- Activar el servidor
server.listen(PUERTO);

//-- Mensaje de inicio
console.log("Escuchando en puerto: " + PUERTO);