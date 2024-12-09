import { DataTypes, Sequelize } from 'sequelize'
import db from '../db/config.js'
import bcrypt from 'bcryptjs'


const User = db.define('tbb_users',{
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    dateOfBirth: {
        type: DataTypes.DATE,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    token: DataTypes.STRING,
    confirmado: DataTypes.BOOLEAN,
    //defaultValue: false
},{
   hooks:{
    beforeCreate: async function(user)
    {
        //Generamos la clave para el hasheo, se recomiendan 10 rondas de aleatorización para no consumir demasiados recursos de hardware y hacer lento el proceso.
         const salt = await bcrypt.genSalt(10)  
         user.password = await bcrypt.hash(user.password, salt);
    },
    beforeUpdate: async function(user)
    {

        //Generamos la clave para el hasheo, se recomiendan 10 rondas de aleatorización para no consumir demasiados recursos de hardware y hacer lento el proceso.
         const salt = await bcrypt.genSalt(10)  
         user.password = await bcrypt.hash(user.password, salt);
    }
}
})

//Métodos personalizados 

User.prototype.passwordVerify = function(passwordFrontEnd)
{
    return bcrypt.compareSync(passwordFrontEnd, this.password);
}


export default User
