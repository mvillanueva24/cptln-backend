import Oracion from '../models/oracion.model.js'
import nodemailer from 'nodemailer'
import ejs from 'ejs'

export const oracion = async (req, res) => {
    const oraciones = await Oracion.find()
    if (!oraciones) return res.status(400).send('No hay oraciones')
    return res.status(200).send(oraciones)
}

export const createOracion = async (req, res) => {
    const { nombres, apellidos, correo, mensaje } = req.body
    try {
        const newOracion = new Oracion({
            nombres: nombres,
            apellidos: apellidos,
            correo: correo,
            mensaje: mensaje
        })
        await newOracion.save()
        res.status(200).send('Oracion creada exitosamente')
    } catch (error) {
        console.log('Ocurrio el siguiente error: ' + error)
    }
}

export const enviarOracionEmail = async (req, res) => {
    const { nombres, apellidos, correo, mensaje } = req.body

}