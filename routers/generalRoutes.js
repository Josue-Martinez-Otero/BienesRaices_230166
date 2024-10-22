import express from 'express';
const router = express.Router();

router.get("/", function(req, res){
    res.send("Hola Mundo desde Node, a travé s del Navegador")
})


router.get("/QuienSoy", function(req, res){
    res.json({"estudiante": "Josue Atlai Martinez Otero", 
        "carrera": "TI DSM",
        "grado": "4°",
        "grupo": "B",
        "asignatura": "Aplicaciones Web Orientada a Servicios (AWOS)"
    })
})


export default router