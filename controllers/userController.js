import { request, response } from 'express';
import { check, validationResult } from 'express-validator';
import User from '../models/User.js';
import { generatetId } from '../models/helpers/tokens.js';
import { emailAfterRegister, emailChangePassword } from '../models/helpers/emails.js';

const formularioLogin = (request, response) => {
    response.render('auth/login', {
        page: "Ingresa a la plataforma",
    });
};

const formularioRegister = (request, response) => {
    response.render('auth/register', {
        page: "Crea una nueva cuenta...",
        csrfToken: request.csrfToken(),
    });
};

const formularioPasswordRecovery = (request, response) => {
    response.render('auth/passwordRecovery', {
        page: "Recuperación de Contraseña",
        csrfToken: request.csrfToken(),
    });
};

const createNewUser = async (request, response) => {
    const { nombre_usuario, correo_usuario, pass_usuario, fecha_nacimiento_usuario } = request.body;

    // Verificar si el usuario ya existe en la base de datos
    const existingUser = await User.findOne({ where: { email: correo_usuario } });

    if (existingUser) {
        return response.render("auth/register", {
            page: "Error al intentar crear la cuenta de Usuario",
            csrfToken: request.csrfToken(),
            errors: [{ msg: `El usuario ${correo_usuario} ya se encuentra registrado.` }],
            user: { name: nombre_usuario, email: correo_usuario },
        });
    }
    console.log("Registrando a un nuevo usuario.");
    console.log(request.body);
    // Validación de los campos
    await check('nombre_usuario').notEmpty().withMessage("El nombre del usuario es obligatorio.").run(request);
    await check('correo_usuario').notEmpty().withMessage("El correo electrónico es obligatorio.")
        .isEmail().withMessage("Debe ingresar un correo electrónico válido.").run(request);
    await check('pass_usuario').notEmpty().withMessage("La contraseña es obligatoria.")
        .isLength({ min: 8 }).withMessage("La contraseña debe tener al menos 8 caracteres.").run(request);
    await check('pass2_usuario').equals(pass_usuario).withMessage("La contraseña y su confirmación deben coincidir.").run(request);
    await check('fecha_nacimiento_usuario').notEmpty().withMessage("La fecha de nacimiento es obligatoria.")
        .isDate().withMessage("Debe ingresar una fecha válida.").run(request);

    const result = validationResult(request);

    if (!result.isEmpty()) {
        return response.render("auth/register", {
            page: "Error al intentar crear la cuenta de Usuario",
            csrfToken: request.csrfToken(),
            errors: result.array(),
            user: { name: nombre_usuario, email: correo_usuario },
        });
    }

    // Crear usuario en la base de datos
    const newUser = await User.create({
        name: nombre_usuario,
        email: correo_usuario,
        password: pass_usuario,
        dateOfBirth: fecha_nacimiento_usuario,
        token: generatetId()
    });

    // Enviar correo de confirmación
    emailAfterRegister({
        name: newUser.name,
        email: newUser.email,
        token: newUser.token,
    });

    response.render('templates/message', {
        page: "Cuenta creada satisfactoriamente",
        msg: `Hemos enviado un correo a: ${correo_usuario}, para confirmar tu cuenta.`,
        csrfToken: request.csrfToken(),
    });
};

const confirm = async (request, response) => {
    const { token } = request.params;
    const userWithToken = await User.findOne({ where: { token } });

    if (!userWithToken) {
        return response.render('auth/accountConfirmed', {
            page: "Error al confirmar tu cuenta.",
            msg: "El token no existe o ya fue utilizado.",
            error: true,
        });
    }

    userWithToken.token = null;
    userWithToken.confirmado = true;
    await userWithToken.save();

    response.render('auth/accountConfirmed', {
        page: "¡Cuenta confirmada!",
        msg: "Tu cuenta ha sido confirmada exitosamente.",
        error: false,
    });
};
const passwordReset = async (request, response) => {
    const { correo_usuario } = request.body;

    await check('correo_usuario').notEmpty().withMessage("El correo es obligatorio.")
        .isEmail().withMessage("Debe ingresar un correo válido.").run(request);

    const result = validationResult(request);

    if (!result.isEmpty()) {
        return response.render("auth/passwordRecovery", {
            page: "Error al intentar recuperar la contraseña",
            errors: result.array(),
            csrfToken: request.csrfToken(),
        });
    }

    const existingUser = await User.findOne({ where: { email: correo_usuario, confirmado: 1 } });

    if (!existingUser) {
        return response.render("auth/passwordRecovery", {
            page: "Error al recuperar la contraseña",
            errors: [{ msg: "No existe un usuario confirmado con este correo." }],
            csrfToken: request.csrfToken(),
        });
    }

    existingUser.token = generatetId();
    await existingUser.save();

    emailChangePassword({
        name: existingUser.name,
        email: existingUser.email,
        token: existingUser.token,
    });

    response.render('templates/message', {
        page: "Solicitud aceptada",
        msg: `Hemos enviado un correo a ${correo_usuario} para actualizar tu contraseña.`,
        csrfToken: request.csrfToken(),
    });
};
const verifyTokenPasswordChange =async(request, response)=>{

    const {token} = request.params;
    const userTokenOwner = await User.findOne({where :{token}})

    if(!userTokenOwner)
        { 
            response.render('templates/message', {
                csrfToken: request.csrfToken(),
                page: 'Error',
                msg: 'El token ha expirado o no existe.'
            })
        }

     
   
    response.render('auth/reset-password', {
        csrfToken: request.csrfToken(),
        page: 'Restablece tu password',
        msg: 'Por favor ingresa tu nueva contraseña'
    })
}
const updatePassword = async (request, response) => {
    const { token } = request.params;

    // Validar campos de contraseña
    await check('new_password').notEmpty().withMessage("La contraseña es obligatoria.")
        .isLength({ min: 8 }).withMessage("Debe tener al menos 8 caracteres.").run(request);
    await check('confirm_new_password').equals(request.body.new_password).withMessage("La contraseña y confirmación deben coincidir.").run(request);

    const result = validationResult(request);

    if (!result.isEmpty()) {
        return response.render("auth/reset-password", {
            page: "Error al actualizar la contraseña",
            errors: result.array(),
            csrfToken: request.csrfToken(),
            token,
        });
    }

    const userTokenOwner = await User.findOne({ where: { token } });
    if (!userTokenOwner) {
        return response.render("auth/reset-password", {
            page: "Error al actualizar la contraseña",
            errors: [{ msg: "Token inválido o expirado." }],
            csrfToken: request.csrfToken(),
        });
    }

    userTokenOwner.password = request.body.new_password;
    userTokenOwner.token = null;
    await userTokenOwner.save();

    response.render('auth/accountConfirmed', {
        page: "¡Contraseña actualizada!",
        msg: "Tu contraseña se ha actualizado correctamente.",
        error: false,
    });
};

const userAuthentication =  async(request, response) =>
    {

        const {correo_usuario:email , pass_usuario:password} = request.body;

        console.log(`El usuario esta intentando acceder con las credenciles usuario: ${email} y la constraseña: ${password}...`)

        // Validar datos desde front
        await check('correo_usuario').notEmpty().withMessage("El correo electrónico es un campo obligatorio.").isEmail().withMessage("El correo electrónico no tiene el formato de: usuario@dominio.extesion").run(request)

        await check('pass_usuario').notEmpty().withMessage("La contraseña es un campo obligatorio.").isLength({min:8}).withMessage("La constraseña debe ser de almenos 8 carácteres.").run(request)
        
        let result = validationResult(request)
    
        //Verificamos si hay errores de validacion
        if(!result.isEmpty())
        {
            return response.render("auth/login", {
                page: 'Login',
                errors: result.array(),
                csrfToken: request.csrfToken()
            })
        }   

        // revisar que exista la cuenta
        const existingUser = await User.findOne({where:{email}})
        // revisar quee la cuenta y la contraseña coincidan con la bd

        if(!existingUser)
        {
            return response.render("auth/login", {
                page: 'Login',
                csrfToken: request.csrfToken(),
                errors: [{msg: `Error, no existe una cuenta asociada a este correo.` }],
                                
            })
        }

        // Verificar que la cuenta este confirmada
        
        if(!existingUser.confirmed)
        {
            return response.render("auth/login", {
                page: 'Login',
                csrfToken: request.csrfToken(),
                errors: [{msg: `Por favor revisa tu correo electrónico y confirma tu cuenta.` }],
                                
            })
        }
        else{

            if(!existingUser.passwordVerify(password))
            {
                return response.render("auth/login", {
                    page: 'Login',
                    csrfToken: request.csrfToken(),
                    errors: [{msg: `La contraseña es incorrecta.` }],
                                    
                })
            }
        }

        //    Si - Renderizar el index
        //    No - Mostrar errores

        return 0;

    }

export {formularioLogin, formularioRegister, formularioPasswordRecovery, createNewUser, confirm, passwordReset, verifyTokenPasswordChange, updatePassword, userAuthentication}
