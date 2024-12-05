import express from 'express';
import { 
    formularioLogin, 
    formularioRegister, 
    formularioPasswordRecovery, 
    createNewUser, 
    confirm, 
    passwordReset, 
    verifyTokenPasswordChange, 
    updatePassword 
} from '../controllers/userController.js';

const router = express.Router();

// GET - Lectura de datos del servidor al cliente
router.get("/findByID/:id", (request, response) => {
    response.send(`Se está solicitando buscar al usuario con ID: ${request.params.id}`);
});

// POST - Envío de datos del cliente al servidor
router.post("/newUser", createNewUser);

// PUT - Actualización total de información
router.put("/replaceUserByEmail/:name/:email/:password", (request, response) => {
    const { name, email, password } = request.params;
    response.send(
        `Se ha solicitado el reemplazo de toda la información del usuario: ${name}, con correo: ${email} y contraseña: ${password}`
    );
});

// PATCH - Actualización parcial de información
router.patch("/updatePassword/:email/:newPassword/:newPasswordConfirm", (request, response) => {
    const { email, newPassword, newPasswordConfirm } = request.params;

    if (newPassword === newPasswordConfirm) {
        response.send(
            `Se ha solicitado la actualización de la contraseña del usuario con correo: ${email}. Cambios aceptados ya que la contraseña y su confirmación coinciden.`
        );
    } else {
        response.send(
            `Se ha solicitado la actualización de la contraseña del usuario con correo: ${email}, pero se rechaza el cambio porque la nueva contraseña y su confirmación no coinciden.`
        );
    }
});

// DELETE - Eliminación de recursos
router.delete("/deleteUser/:email", (request, response) => {
    response.send(`Se ha solicitado la eliminación del usuario asociado al correo: ${request.params.email}`);
});

// Rutas de autenticación y recuperación de contraseña
router.get("/login", formularioLogin /*middleware*/ )
 router.get("/createAccount", formularioRegister)
 router.get("/confirmAccount/:token", confirm)
 router.get("/passwordRecovery", formularioPasswordRecovery)
 router.post("/passwordRecovery", passwordReset)

//Actualizar contraseña
router.get("/passwordRecovery/:token", verifyTokenPasswordChange) 
router.post("/passwordRecovery/:token", updatePassword)
export default router;
