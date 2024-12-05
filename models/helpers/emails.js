import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config({path: '.env'})
                           
 const emailAfterRegister = async (newUserData) =>{
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth:{
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    })

    //console.log(data)
    const {email,name, token} = newUserData

    //Enviar el email
    await transport.sendMail({
        from: 'bienesraices-230166.com',
        to: email,
        subject: 'Bienvenid/a al BienesRaices-230166',
        text: 'Ya casi puedes usar nuestra plataforma, solo falta confirmar tu cuenta.',
        html: `
            <div style="font-family: Arial, sans-serif; background-color: #87CEEB; padding: 20px; border-radius: 10px; color: #333;">
                <h2 style="color: #2D87F0;">¡Hola, <span style="color: red;">${name}</span>!</h2>
                <p>Te damos la bienvenida a <strong>BienesRaices-230166</strong>, la plataforma donde podrás buscar, comprar y ofertar propiedades de manera segura.</p>
                <p>Para comenzar a utilizar la plataforma, solo necesitas confirmar tu cuenta. Haz clic en el siguiente enlace para activarla:</p>
                <p style="text-align: center;">
                    <a href="${process.env.BACKEND_DOMAIN}:${process.env.BACKEND_PORT}/auth/confirmAccount/${token}" 
                    style="background-color: #2D87F0; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                        Confirmar Cuenta
                    </a>
                </p>
                <p>¡Gracias por elegirnos!<br>El CEO de <strong>BienesRaices-230166</strong> Te da la Bienvenida a este sitio.</p>
                <br>
                <p>Si no fuiste tú quien creó esta cuenta, por favor ignora este mensaje.</p>
                <br>
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ccc; text-align: center; font-size: 14px; color: #666;">
            <h1>Contáctanos para mayor información</h1>
            <img src="https://i.imgur.com/zbHa3eP.png" alt="Firma CEO de BienesRaices" style="max-width: 200px; height: auto; margin-bottom: 10px;">
            <p>Atentamente,<br><strong>El equipo de BienesRaices-230166</strong></p>
            <p><i>Visítanos en: <a href="bienesraices-230166" style="color: #2D87F0;">bienesraices-230166.com</a></i></p>
            <p><i>Correo de contacto: <a href="mailto:contacto@bienesraices-230166.com" style="color: #2D87F0;">contacto@bienesraices-230166.com</a></i></p>
            <p><i>Teléfono: +52 776 110 7258</i></p>
        </div>
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ccc; text-align: center; font-size: 14px; color: #666;">
         </div></p>` 

    })
}
const emailChangePassword = async (userData) =>{
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth:{
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    })

    //console.log(data)
    const {email,name, token} = userData

    //Enviar el email
    await transport.sendMail({
        from: 'bienesraices-230166.com',
        to: email,
        subject: 'Bienvenid/a al BienesRaices-230166',
        text: 'Por favor actualiza tu contraseña para ingresar a la plataforma',
        html: `
            <div style="font-family: Arial, sans-serif; background-color: #87CEEB; padding: 20px; border-radius: 10px; color: #333;">
                <h2 style="color: #2D87F0;">¡Hola, <span style="color: red;">${name}</span>!</h2>
                <p>Te damos la bienvenida a <strong>BienesRaices-230166</strong>,  Haz reportado el olvido o perdida de tu contraseña para acceder a tu cuenta de BienesRaices.</p><br>
                <p> Por lo que necesitamos que  igreses a la siguiente liga para:</p><br>
                <p style="text-align: center;">
                    <a href="${process.env.BACKEND_DOMAIN}:${process.env.BACKEND_PORT}/auth/passwordRecovery/${token}" 
                    style="background-color: #2D87F0; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                        Actualizar Cuenta
                    </a>
                </p>
                <p>¡Gracias por elegirnos!<br>El CEO de <strong>BienesRaices-230166</strong> Te da la Bienvenida a este sitio.</p>
                <br>
                <p>Si no fuiste tú quien solicito el reseteo de tu contraseña de esta cuenta, por favor ignora este mensaje.</p>
                <br>
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ccc; text-align: center; font-size: 14px; color: #666;">
            <h1>Contáctanos para mayor información</h1>
            <img src="https://i.imgur.com/zbHa3eP.png" alt="Firma CEO de BienesRaices" style="max-width: 200px; height: auto; margin-bottom: 10px;">
            <p>Atentamente,<br><strong>El equipo de BienesRaices-230166</strong></p>
            <p><i>Visítanos en: <a href="bienesraices-230166" style="color: #2D87F0;">bienesraices-230166.com</a></i></p>
            <p><i>Correo de contacto: <a href="mailto:contacto@bienesraices-230166.com" style="color: #2D87F0;">contacto@bienesraices-230166.com</a></i></p>
            <p><i>Teléfono: +52 776 110 7258</i></p>
        </div>
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ccc; text-align: center; font-size: 14px; color: #666;">
         </div></p>` 

    })
}

export {emailAfterRegister, emailChangePassword}