import { Radio, SeccionRadio, ContenidoSeccionRadio } from "../models/radio.model.js";
import { upload, getFileURL } from "../aws/s3.js";
import mongoose from "mongoose";

// METHOD DE RADIO

const crearRadio = async (req, res) => {
    const { nombre, descripcion } = req.body
    const newRadio = new Radio({
        nombre: nombre,
        descripcion: descripcion,
    })
    if (req.files) {
        if (req.files && req.files.portada) {
            const { portada } = req.files
            const ruta = `radio/${newRadio._id}/${portada.name}`
            await upload(portada, ruta)
            newRadio.portada = ruta
        }
        if (req.files && req.files.imagenesExtra) {
            const { imagenes } = req.files
            for (const imagen of Array.isArray(imagenes) ? imagenes : [imagenes]) {
                const ruta = `radio/${newRadio._id}/${portada.name}`
                await upload(imagen, ruta)
                newRadio.imagenes.push(ruta)
            }
        }
    }
    await newRadio.save()
    return newRadio
}

export const obtenerDatosRadio = async (req, res) => {
    const radio = await Radio.findOne()
    if (!radio) return res.status(404).send('No encontrado');
    return res.status(200).send(radio)
}

export const actualizarDatosRadio = async (req, res) => {
    const { id, nombre, descripcion } = req.body
    console.log(req.files);
    if (id == null) {
        const radio = await crearRadio(req)
        return res.status(200).send(radio)
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(200).send(false);
    }
    const radio = await Radio.findById(id)
    if (!radio) return res.status(404).send('No encontrado');
    if (nombre != undefined) {
        radio.nombre = nombre
    }
    if (descripcion != undefined) {
        radio.descripcion = descripcion
    }
    if (req.files) {
        if (req.files && req.files.portada) {
            try {
                const { portada } = req.files
                const ruta = `radio/${radio._id}/${portada.name}`
                await upload(portada, ruta)
                radio.portada = ruta
            } catch (error) {
                console.log(error);
                return res.status(500).send('Error al modificar la portada');
            }
        }
        if (req.files && req.files.imagenes) {
            try {
                const { imagenes } = req.files
                radio.imagenes = []
                for (const imagen of Array.isArray(imagenes) ? imagenes : [imagenes]) {
                    const ruta = `radio/${radio._id}/${imagen.name}`
                    await upload(imagen, ruta)
                    radio.imagenes.push(ruta)
                }
            } catch (error) {
                console.log(error);
                return res.status(500).send('Error al modificar las imagenes');
            }
        }
    }
    await radio.save()
    return res.status(200).send('Cambios guardados correctamente')
}


// METHOD PARA LAS SECCIONES DE LA RADIO

export const obtenerSecciones = async(req, res) => {
    const radio = await Radio.findOne()    
    const secciones = radio.secciones
    if (!secciones) return res.status(400).send('Aun no hay secciones');
    return res.status(200).send(secciones)
}

export const obtenerSeccion = async(req, res) => {
    const radio = await Radio.findOne()
    const { idseccion } = req.params
    const seccionFound = radio.secciones.find((seccion) => seccion._id.toString() === idseccion)
    return res.status(200).send(seccionFound)
}

export const agregarSeccion = async(req, res) => {
    const radio = await Radio.findOne()
    const { nombre } = req.body
    const newSeccion = new SeccionRadio({
        nombre: nombre
    })
    radio.secciones.push(newSeccion)
    await radio.save()
    return res.status(200).send('OK')
}

export const modificarSeccion = async(req, res) => {
    const radio = await Radio.findOne()
    const { nombre } = req.body
    const { idseccion } = req.params
    try {
        const seccionFound = radio.secciones.find((seccion)=> seccion._id.toString() === idseccion)
        seccionFound.nombre = nombre
    } catch (error) {
        return res.status(304).send(error)
    }
    await radio.save()
    return res.status(200).send('OK')
}