import {check, validationResult} from 'express-validator'
import User from '../models/User.js' 
import { generatetId } from '../models/helpers/tokens.js';
import { Token } from 'graphql';
//import { emit } from 'nodemon';

//import { request, response } from "express";
//import req from 'express/lib/request.js';
//import { where } from 'sequelize';
//import { emit } from 'nodemon';

const formularioLogin = (request, response) =>  {
    response.render('auth/login', {
        page : "Ingresa a la plataforma"
        
    })};

const formularioRegister = (request, response) =>  {
        response.render('auth/register', {
             page : "Crea una nueva cuenta..."
        })};

 

const formularioPasswordRecovery = (request, response) =>  {
    response.render('auth/passwordRecovery', {
            page : "Recuperación de Contraseña"
     })};

     const createNewUser= async(request,response)=>{
            //Desestructurar los parametros del rquest
            const { nombre_usuario, correo_usuario, password_usuario } = request.body;
            //Verificar que el usuario no existe previamente en la bd
            const existingUser = await User.findOne({ where: { email: correo_usuario } });
            console.log(existingUser);
            if(existingUser)
            {
                return response.render("auth/register", {
                    page: "Error al intentar crear la cuenta de Usuario",
                    errors: [{msg: `El usuario ${correo_usuario} ya se encuentra registrado`}],
                    user: {
                        name: name
                    }
                })
            }
            console.log("Registrando a un nuevo usuario.");
            console.log(request.body);
            //Validación de los campos que se reciben del formulario
            await check('nombre_usuario').notEmpty().withMessage("El nombre del usuario es un campo obligatorio.").run(request)
            await check('correo_usuario').notEmpty().withMessage("El correo electrónico es un campo obligatorio.").isEmail().withMessage("").run(request)
            await check('password_usuario').notEmpty().withMessage("La contraseña es un campo obligatorio.").isLength({min:8}).withMessage("La contraseña debe ser de almenos 8 carácteres.").run(request)
            await check('pass2_usuario').equals(request.body.password_usuario).withMessage("La contraseñay su confirmación deben coincidir").run(request)
            let result = validationResult(request)
           // response.json(resultado.array());
        
                //Verificación si hay errores de validaciones
            if(!result.isEmpty())
            {
               return response.render("auth/register", {
                   page: 'Error al intentar crear la Cuenta de Usuario',
                   errors: result.array() 
               })
            }
            else{
                console.log("Registrando a nuevo usuario");
                console.log(request.body);
            }
           //Registro a los datos en la base de datos.
            const newUser = await User.create({
            name: request.body.nombre_usuario,
            email: request.body.correo_usuario,
            password: request.body.password_usuario,
          });
          response.json(newUser);

          return;
     }

     //Almacenar un usuario 
     await User.create({
       name,
       email,
       password,
       token: generatetId()   
     })

     //Mostrar mensaje de confirmación
     
    

export {formularioLogin, formularioRegister, formularioPasswordRecovery, createNewUser}