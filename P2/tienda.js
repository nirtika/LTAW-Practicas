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
  // usuario y contraseña
  let nombre=[];
  let passwords=[];

  // leer y guaradr en base de datos

  data_tienda[1]["usuarios"].forEach((element, index)=>{
    console.log("Usuario " + (index + 1) + ": " + element.usuario);
    nombre.push(element.usuario);
    passwords.push(element.password)
  });


  
  // base de datos

  const datos_base = "tienda.json";
  const data_tienda = fs.readFileSync("tienda.json"); //-- tienda.json
  const productos = tienda[0].parse(data_tienda); //-- base de datos
  const item = tienda[0].productos //-- lista de productos
  const pedido_final = data_tienda[2]['Finalizar']

  // array para productos

  let productos_base =[]
  let pcarrito = [] // productos en el carrito

  // añadir los nombre de los productos en el array
  for (i=0; i<item.length; i++){
    nombre_prod = Object.keys(item[i])[0]
    products = item[i]
    lista_prod = products[nombre_prod]
    products_base.push(lista_prod)
  
  }

//-- Crear el sevidor
const server = http.createServer(function (req, res) {

  // cookies

  let pedido = '';
  let username = '';
  let cookie_pedido ='';

  const cookie = req.headers.cookie

  if (cookie){
    let cookies = cookie.split(';')
    //-- Recorro las cookies obtenidas
    cookies.forEach((element) => {

      //-- Obtengo la cookie completa con el value
      let[elemento, value] = element.split('=')

      //-- Miro si la cookie es de tipo user
      if(elemento.trim() === 'user'){
        username = value
        console.log(username)
      }else if (elemento.trim() === 'carrito'){
        cookie_pedido = value
      }
    })

  }else{
    console.log("No hay cookies")
  
  }

  console.log("  Parametros: " + url.searchParams); //-- nombre del usuario

    //-- Obtengo los parametros rellenados en el formulario
    name_user = url.searchParams.get('nombre')
    console.log("El nombre de usuario es: " + name_user)
    let pass = url.searchParams.get('password')
    console.log("La contraseña es: " + pass)
    let direccion = url.searchParams.get('direccion')
    console.log("La direccion es: " + direccion)
    let tarjeta = url.searchParams.get('tarjeta')
    console.log("El numero de tarjeta es: " + tarjeta)

 //-- Aqui almaceno el content solicitado
  let contenido = "";

  //-- Añado el numero de tarjeta y direccion si no son vacio
  if((direccion != null) && (tarjeta != null)){

    let tramite = {
      "usuario": name_user,
      "productos": pcarrito,
      "tarjeta": tarjeta,
      "direccion": direccion
    }


    //-- Agregar  pedido en la base Json
    pedido_final.push(tramite)

    //-- Conviertir variable a cadena JSON
    let mytienda = JSON.stringify(tienda);

    //-- la guardo en el fichero destino
    fs.writeFileSync(datos_base, mytienda);
  }


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