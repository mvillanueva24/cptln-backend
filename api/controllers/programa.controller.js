import { getFileURL, upload } from '../aws/s3.js'
import Programa from '../models/programa.model.js'

// export const programas = async(req, res) => {
//     const programas = await Programa.find()
//     return res.send(programas)
// }

export const programas = async (req, res) => {
    const programasFound = await Programa.find().limit(3)
    for (const programa of programasFound) {
        const imagenes = programa.imagenes
        programa.imagenes = []
        for (const imagen of imagenes) {
            const ruta = await getFileURL(imagen.ruta)
            programa.imagenes.push({ ruta: ruta, estado: imagen.estado })
        }
    }
    return res.status(200).send(programasFound)
}

export const programasPorCategoria = async (req, res) => {
    const { nombre } = req.body
    const customNombre = nombre.replace(/-/g, ' ');
    const programasFound = await Programa.find({ categoria: { $regex: new RegExp(`^${customNombre.toLowerCase()}$`, "i") } })
    for (const programa of programasFound) {
        const imagenes = programa.imagenes
        programa.imagenes = []
        for (const imagen of imagenes) {
            const ruta = await getFileURL(imagen.ruta)
            programa.imagenes.push({ ruta: ruta, estado: imagen.estado })
        }
    }
    return res.status(200).send(programasFound)
}

export const programasPagination = async (req, res) => {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 2
    const programas = await Programa.find().skip((page - 1) * limit).limit(limit)
    const totalProgramas = await Programa.countDocuments()
    if (programas.length == 0) return res.status(400).send('Aun no hay programas')
    return res.status(200).json({
        programas,
        currentPage: page,
        totalPages: Math.ceil(totalProgramas / limit),
        totalProgramas
    })
}

export const crearPrograma = async (req, res) => {
    const { titulo, categoria, color } = req.body
    const { imagenes } = req.files
    let imagenesProgram = []
    for (const imagen of imagenes) {
        const ruta = `programas/${titulo}/${imagen.name}`
        await upload(imagen, ruta)
        imagenesProgram.push({
            ruta: ruta,
            estado: true,
            color: color
        })
    }
    await new Programa({
        titulo: titulo,
        categoria: categoria,
        imagenes: imagenesProgram
    }).save()
    res.send('OK')
}

export const buscarPrograma = async(req, res)=>{
    const { id } = req.params
    const ProgramaFound = await Programa.findById(id)
    if (!ProgramaFound) return res.status(404).send('No encontrado')
    const imagenes = ProgramaFound.imagenes
    ProgramaFound.imagenes = []
    for(const imagen of imagenes){
        const tmp = imagen.ruta
        const ruta = await getFileURL(tmp)
        ProgramaFound.imagenes.push({ruta: ruta, estado: imagen.estado})
    }
    return res.status(200).send(ProgramaFound)
}

export const borrarPrograma = async(req, res)=>{
    const { id } = req.body
    try {
        const ProgramaFound = await Programa.findById(id)
        if (!ProgramaFound) return res.status(404).json('Devocional no encontrado')
        const updateData = { estado: !ProgramaFound.estado }
        await Programa.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        )
        return res.status(200).json('Eliminado exitosamente')
    } catch (error) {
        console.log(error)
    }
}