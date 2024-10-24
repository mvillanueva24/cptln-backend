import { upload } from '../aws/s3.js'
import Programa from '../models/programa.model.js'

export const programas = async(req, res) => {
    const programas = await Programa.find()
    return res.send(programas)
}

export const crearPrograma = async(req, res) => {
    const { titulo, categoria, link } = req.body
    const { imagenes } = req.files
    let imagenesProgram = []
    for (const imagen of imagenes) {
        const ruta = `programas/${titulo}/${imagen.name}`
        await upload(imagen, ruta)
        imagenesProgram.push({
            ruta: ruta,
            estado: true
        })
    }
    await new Programa({
        titulo: titulo,
        categoria: categoria,
        link: link,
        imagenes: imagenesProgram
    }).save()
    res.send('OK')
}