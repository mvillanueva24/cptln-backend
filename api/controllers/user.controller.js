import { createAccessToken } from "../libs/jwt.js"
import User from "../models/user.model.js" //* Modelo del Usuario
import bcrypt from 'bcryptjs' //* Se usa para poder encriptar, en este caso, la contraseña
import jwt from 'jsonwebtoken'
import {TOKEN_SECRET} from '../libs/configToken.js'

//* Metodo de registro de usuarios
export const register = async (req, res) => {
    console.log(req.body);
    const { nombres, apellidos, correo, password } = req.body
    try {
        //Guardar usuario
        const passwordHash = await bcrypt.hash(password, 10)
        const newUser = new User({                
            nombres,                                          
            apellidos,                                                       
            correo,
            contraseña: passwordHash                                        
        })                                                                  
        const UserNew = await newUser.save()

        // Respuesta para el frontend
        res.json({
            id: UserNew._id,
            nombres: UserNew.nombres,
            apellidos: UserNew.apellidos,
            correo: UserNew.correo,
            createdAt: UserNew.createdAt,
            updateAt: UserNew.updateAt
        })

    } catch (error) {
        console.log(error);
        return res.status(500).send('Ocurrio un error')
    }
}

export const login = async (req, res) => {
    const { correo, password } = req.body;
    try {
        const userFound = await User.findOne({ correo });
        if (!userFound) {
            return res.status(404).json({ 'message': 'Usuario no encontrado' });
        }
        const isMatch = await bcrypt.compare(password, userFound.contraseña);
        if (!isMatch) {
            return res.status(400).json({ 'message': 'Credenciales incorrectas' });
        }

        const token = await createAccessToken({ id: userFound._id });

        // Establece la cookie manualmente usando setHeader
        res.setHeader('Set-Cookie', `token=${token}; HttpOnly; Path=/; Max-Age=3600; SameSite=Lax; Secure=${process.env.NODE_ENV === 'production'}`);

        // Respuesta para el frontend
        res.status(200).json({
            id: userFound._id,
            nombres: userFound.nombres,
            apellidos: userFound.apellidos,
            correo:  userFound.correo,
            createdAt: userFound.createdAt,
            updateAt: userFound.updateAt
        });

    } catch (error) {
        res.status(500).json({ 'message': error.message });
    }
};


export const logout = (req, res) => {
    res.cookie('token', '', {
        expires: new Date(0)
    })
    return res.sendStatus(200)
}

export const verifyToken = async (req, res) => {
    console.log(req.cookies);
    const { token } = req.cookies;
    if (!token) return res.send(false);

    jwt.verify(token, TOKEN_SECRET, async (error, user) => {
        if (error) return res.sendStatus(400).json({
            'API Error': error
        });

        const userFound = await User.findById(user.id);
        if (!userFound) return res.sendStatus(404).json({
            'API Error': 'Usuario no encontrado'
        });

        return res.json({
            id: userFound._id,
            nombres: userFound.nombres,
            apellidos: userFound.apellidos,
            correo: userFound.correo
        })
    })
}