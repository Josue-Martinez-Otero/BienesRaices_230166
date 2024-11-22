import { check, validationResult } from 'express-validator';
import User from '../models/User.js';
import { generatetId } from '../models/helpers/tokens.js';
import { emailAfterRegister } from '../models/helpers/emails.js';

const formularioLogin = (request, response) => {
    response.render('auth/login', {
        page: "Ingresa a la plataforma"
    });
};

const formularioRegister = (request, response) => {
    response.render('auth/register', {
        page: "Crea una nueva cuenta...",
        csrfToken: request.csrfToken()
    });
};

const formularioPasswordRecovery = (request, response) => {
    response.render('auth/passwordRecovery', {
        page: "Recuperación de Contraseña"
    });
};

const createNewUser = async (request, response) => {
    // Desestructurar los parámetros del request
    const { nombre_usuario, correo_usuario, password_usuario } = request.body;

    // Verificar que el usuario no existe previamente en la bd
    const existingUser = await User.findOne({ where: { email: correo_usuario } });

    if (existingUser) {
        return response.render("auth/register", {
            page: "Error al intentar crear la cuenta de Usuario",
            csrfToken: request.csrfToken(),
            errors: [{ msg: `El usuario ${correo_usuario} ya se encuentra registrado` }],
            user: { name: nombre_usuario }  // Use nombre_usuario here
        });
    }

    console.log("Registrando a un nuevo usuario.");
    console.log(request.body);

    // Validación de los campos que se reciben del formulario
    await check('nombre_usuario')
        .notEmpty().withMessage("El nombre del usuario es un campo obligatorio.")
        .run(request);
    await check('correo_usuario')
        .notEmpty().withMessage("El correo electrónico es un campo obligatorio.")
        .isEmail().withMessage("Debe ingresar un correo electrónico válido.")
        .run(request);
    await check('password_usuario')
        .notEmpty().withMessage("La contraseña es un campo obligatorio.")
        .isLength({ min: 8 }).withMessage("La contraseña debe ser de al menos 8 caracteres.")
        .run(request);
    await check('pass2_usuario')
        .equals(request.body.password_usuario).withMessage("La contraseña y su confirmación deben coincidir.")
        .run(request);

    let result = validationResult(request);

    // Verificación si hay errores de validaciones
    if (!result.isEmpty()) {
        return response.render("auth/register", {
            page: 'Error al intentar crear la Cuenta de Usuario',
            errors: result.array()
        });
    } else {
        console.log("Registrando a nuevo usuario");
        console.log(request.body);
    }

    // Registro a los datos en la base de datos.
    const newUser = await User.create({
        name: nombre_usuario,  // Use nombre_usuario here
        email: correo_usuario,
        password: password_usuario,
        token: generatetId()   // Generate token here
    });

    // Enviar el correo de confirmación
    await emailAfterRegister({
        name: newUser.name,
        email: newUser.email,
        token: newUser.token
    });

    // Mostrar mensaje de confirmación
    response.render('templates/message', {
        csrfToken: request.csrfToken(),
        page: 'Cuenta creada satisfactoriamente.',
        msg: `Hemos enviado un correo a: ${correo_usuario}, para la confirmación de su cuenta.` 
        });
    
};

// Confirmación de cuenta
const confirm = async (request, response) => {
    const { token } = request.params;
    console.log(`Intentando confirmar la cuenta con el token: ${token}`);

    // Validar token, confirmar cuenta y enviar mensaje
    // Aquí se puede agregar la lógica para confirmar la cuenta
    const userWithToken = await User.findOne({where: {token}});

    if(!userWithToken){
        response.render('auth/accountConfirmed', {
            page: 'Error al confirmar tu cuenta.',
            msg: 'El token no existe o ya ha sido utilizado, intenta de nuevo.',
            error: true
        })
    }
    else
    {
        userWithToken.token=null
        userWithToken.confirmed=true;
        await userWithToken.save();

        response.render('auth/accountConfirmed', {
            page: 'Excelente..!',
            msg: 'Tu cuenta ha sido confirmada de manera exitosa.',
            error: false
        })

    }
    

};

export { formularioLogin, formularioRegister, formularioPasswordRecovery, createNewUser, confirm };
