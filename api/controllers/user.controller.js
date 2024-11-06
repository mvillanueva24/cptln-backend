import { createAccessToken } from "../libs/jwt.js"
import User from "../models/user.model.js" 
import bcrypt from 'bcryptjs' 
import jwt from 'jsonwebtoken'
import { TOKEN_SECRET } from '../libs/configToken.js'

//* Metodo de registro de usuarios

export const obtenerUsuarios = async (req, res) => {
    const usuarios = await User.find()
    if (!usuarios) return res.status(400).send('Sin usuarios');
    return res.status(200).send(usuarios)
}

export const register = async (req, res) => {
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
        return res.status(200).json({
            id: userFound._id,
            username: userFound.username,
            email: userFound.email,
            dni: userFound.dni,
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
    const { token } = req.cookies;
    console.log(req.cookies);
    if (!token) return res.send(false);
    
    jwt.verify(token, TOKEN_SECRET, async (error, user) => {

        if (error) return res.sendStatus(400)

        const userFound = await User.findById(user.id);

        if (!userFound) return res.sendStatus(404)

        return res.status(200).json({
            id: userFound._id,
            nombres: userFound.nombres,
            apellidos: userFound.apellidos,
            correo: userFound.correo
        })
    })
}