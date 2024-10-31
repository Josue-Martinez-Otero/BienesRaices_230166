const formularioLogin = (request, response) =>  {
    response.render('auth/login', {
        autenticado:false
        
    })};

const formularioRegister = (request, response) =>  {
        response.render('auth/register', {
            
        })};

const formularioPasswordRecovery = (request, response) =>  {
    response.render('auth/passwordRecovery', {
                
     })};
     
export {formularioLogin, formularioRegister, formularioPasswordRecovery}