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
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    token: DataTypes.STRING,
    confirmado: DataTypes.BOOLEAN
},{
   hooks:{
    beforeCreate: async function(user) {
        //Generamos la clave para el hasheo, se recomienda 10 rondas de alleatorización para no consumir demasiados recursos de hardware y hacer lento el proceso.
        const salt= await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(user.password, salt);
    }
   } 
})


export default User
