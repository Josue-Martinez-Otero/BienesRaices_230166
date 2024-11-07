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
     
export {formularioLogin, formularioRegister, formularioPasswordRecovery}