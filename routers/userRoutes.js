import express from 'express';

const router = express.Router();

//GET
router.get("/busquedaPorID/:id", function (request,response){
    response.send(`Se esta solicitando buscar al usuario con ID: ${request.params.id}`);
})  // 2 componentes de una petición ruta, función callback 

//POST

//PUT

export default router