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
        text: 'Ya casi puedes usar nuestra plataforma, solo falta...',
        html: `<p> Hola, <span style="color: red"> ${name}</span>, <br>
        Bienvenido a la plataforma de BienesRaices, el sitio seguro donde podrás buscar, comprar y ofertar propiedades a través de internet.
        <br>
        <p> Ya solo necesitamos confirmar la cuenta que creaste, dando click a la siguiente liga: <a href:"${process.env.BACKED_HOST}:${process.env.BACKEND_PORT}/confirmAccout/${token}">Confirmar cuenta</a></p>` 

    })
}

export {emailAfterRegister}