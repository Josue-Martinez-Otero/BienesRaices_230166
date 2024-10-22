import express from 'express';
import generalRoutes from './routers/generalRoutes.js'
import userRoutes from './routers/userRoutes.js'
//const express = require(`express`); // Importar la libreria para crear un servidor web- CommonJS

// Instanciar nuestra aplicación web
const app = express()

// Configuramos nuestro servidor web 
const port = 3000;
app.listen(port, ()=>{
   console.log(`La aplicación ha iniciado en el puesto: ${port}`);
})

//Routing - Enrutamiento.
app.use('/',generalRoutes);
app.use('/usuario',userRoutes);
// Probamos las rutas para poder presentar mensajes al usuario a través del navegador


