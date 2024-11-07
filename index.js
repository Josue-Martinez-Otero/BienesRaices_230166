const router = express.Router();
import express from 'express';
import generalRoutes from './routers/generalRoutes.js'
import userRoutes from './routers/userRoutes.js'
//const express = require(`express`); // Importar la libreria para crear un servidor web- CommonJS

// Instanciar nuestra aplicación web
const app = express()

//Habilitar PUG
app.set('view engine','pug');
app.set('views','./views')

//Definir la carpeta úbicada de recursos estáticos(assets)
app.use(express.static('./public'));

// Configuramos nuestro servidor web 
const port = 3000;
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
app.use('/',generalRoutes)
app.use('/auth',userRoutes)
export default router;

