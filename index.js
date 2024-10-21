const express = require(`express`); // Importar la libreria para crear un servidor web

// Instanciar nuestra aplicación web
const app = express()

// Configuramos nuestro servidor web 
const port = 3000;
app.listen(port, ()=>{
   console.log(`La aplicación ha iniciado en el puesto: ${port}`);
})

// Probamos las rutas para poder presentar mensajes al usuario a través del navegador
app.get("/", function(req, res){
    res.send("Hola Mundo desde Node, a travé s del Navegador")
})

app.get("/QuienSoy", function(req, res){
    res.json({"estudiante": "Josue Atlai Martinez Otero", 
        "carrera": "TI DSM",
        "grado": "4°",
        "grupo": "B",
        "asignatura": "Aplicaciones Web Orientada a Servicios (AWOS)"
    })
})