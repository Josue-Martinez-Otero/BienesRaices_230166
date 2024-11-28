
//const router = express.Router();
//Librerias Globales
import express from 'express';
import csrf from 'csurf'
import cookieParser from 'cookie-parser';

//librerias especificoas del proyecto
import generalRoutes from './routers/generalRoutes.js'
import userRoutes from './routers/userRoutes.js'
import db from './db/config.js'
import dotenv from 'dotenv'
//import csrf from 'csurf'
//import cookieParser from 'cookie-parser';

dotenv.config({path: '.env'})
//const express = require(`express`); // Importar la libreria para crear un servidor web- CommonJS

// Instanciar nuestra aplicación web
const app = express()

// Habilitar Cookie Parser 
app.use(cookieParser())

// Habilitar CSRF
app.use(csrf({cookie: true}))

//Conexión a la base de datos
try {
    await db.authenticate(); //Verifico las credenciales del usuario
    db.sync(); // Sincroniza las tablas 
    console.log("Conexión establecida");

}catch (error) {
    console.log(error)
}
// Habilitar Cookie Parser 
//app.use(cookieParser())

// Habilitar CSRF
//app.use(csrf({cookie: true}))

//Habilitando la lectura de datos del formulario
app.use(express.urlencoded({ extended: true }));


//Habilitar PUG
app.set('view engine','pug');
app.set('views','./views')

//Definir la carpeta úbicada de recursos estáticos(assets)
app.use(express.static('./public'));

// Configuramos nuestro servidor web 
const port = process.env.BACKEND_PORT;
app.listen(port, ()=>{
   console.log(`La aplicación ha iniciado en el puerto: ${port}`);
})

//Routing - Enrutamiento.
app.use('/',generalRoutes);
app.use('/auth',userRoutes);

// Probamos las rutas para poder presentar mensajes al usuario a través del navegador
app.get("/",function(req,res){
    res.send("Hola Mundo desde node, a traves del navegador")
})
app.use('/',generalRoutes);
app.use('/auth',userRoutes);
//export default router;
