import { Curso, Capitulo } from '../models/curso.model.js'
import { upload, getFileURL } from '../aws/s3.js'

export const cursos = async (req, res) => {
    const cursos = await Curso.find()
    if (cursos.length == 0) return res.status(400).send('No hay cursos');
    return res.status(200).send(cursos)
}

export const cursosPagination = async (req, res) => {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 2
    const cursos = await Curso.find().skip((page - 1) * limit).limit(limit)
    const totalCursos = await Curso.countDocuments()
    if (cursos.length == 0) return res.status(400).send('Aun no hay cursos')
    return res.status(200).json({
        cursos,
        currentPage: page,
        totalPages: Math.ceil(totalCursos / limit),
        totalCursos
    })
}

export const cursosCapitulosPagination = async(req, res) => {
    const { idcurso } = req.params
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 2
    const cursoFound = await Curso.findById(idcurso)
    if (!cursoFound) return res.status(400).send('No encontrado');
    const capitulosCurso = cursoFound.capitulos.slice((page - 1), (page - 1 + limit))
    const totalCapitulosCurso = cursoFound.capitulos.length
    if (capitulosCurso.length == 0) return res.status(400).send('Aun no hay capitulos');
    return res.status(200).json({
        capitulosCurso,
        currentPage: page,
        totalPages: Math.ceil(totalCapitulosCurso / limit),
        totalCapitulosCurso
    })
}

export const crearCurso = async (req, res) => {
    const { titulo, descripcion } = req.body
    try {
        const newCurso = new Curso({
            titulo: titulo,
            descripcion: descripcion
        })
        await newCurso.save()
    } catch (error) {
        console.log(error)
    }
}

export const crearCapituloCurso = async (req, res) => {
    const { id } = req.params
    const { titulo, idyoutube } = req.body
    const cursoFound = await Curso.findById(id)
    if (!cursoFound) return res.status(404).send('No encontrado');
    const newCapitulo = new Capitulo({
        titulo: titulo,
        idYoutube: idyoutube
    })
    if (req.files && req.files.pdf) {
        const { pdf } = req.files
        const ruta = `cursos/${cursoFound._id}/${newCapitulo._id}/${pdf.name}`
        await upload(pdf, ruta)
        newCapitulo.pdf = ruta
    }
    cursoFound.capitulos.push(newCapitulo)
    await cursoFound.save()
    return res.status(200).send('OK')
}

export const buscarCursos = async (req, res) => {
    const { idcurso } = req.params
    const cursoFound = await Curso.findById(idcurso)
    if (!cursoFound) return res.status(404).send('No encontrado');
    return res.status(200).send(cursoFound)
}

export const buscarContenidoDelCurso = async (req, res) => {
    const { idcurso } = req.params
    const cursoFound = await Curso.findById(idcurso)
    if (!cursoFound) return res.status(404).send('No encontrado');
    return res.status(200).send(cursoFound.capitulos)
}

export const buscarCapituloEspecifico = async (req, res) => {
    const { idcurso, id } = req.params
    const cursoFound = await Curso.findById(idcurso)
    if (!cursoFound) return res.status(404).send('No encontrado');
    const contenidoFound = cursoFound.capitulos.find((capitulo) => capitulo._id === id)
    if (!contenidoFound) return res.status(404).send('Capitulo no encontrado');
    if (contenidoFound.pdf) {
        const tmp = contenidoFound.pdf
        contenidoFound.pdf = await getFileURL(tmp)
    }
    return res.status(200).send(contenidoFound)
}

export const editarCurso = async (req, res) => {
    const { id } = req.params
    const { titulo, descripcion } = req.body
    try {
        const cursoFound = await Curso.findByIdAndUpdate(
            id,
            { titulo, descripcion },
            { new: true }
        )
        if (!cursoFound) return res.status(404).send('No encontrado');
        return res.status(200).send('Modificado correctamente')
    } catch (error) {
        console.log(error);
    }
}

export const editarCapituloCurso = async (req, res) => {
    const { idcurso, id } = req.params
    const { titulo, idyoutube } = req.body
    const cursoFound = await Curso.findById(idcurso)
    if (!cursoFound) return res.status(404).send('No encontrado');
    const contenidoFound = cursoFound.capitulos.find((capitulo) => capitulo._id === id)
    if (!contenidoFound) return res.status(404).send('Capitulo no encontrado');
    contenidoFound.titulo = titulo
    contenidoFound.idYoutube = idyoutube
    if (req.files && req.files.pdf) {
        const { pdf } = req.files
        const ruta = `cursos/${cursoFound._id}/${contenidoFound._id}/${pdf.name}`
        contenidoFound.pdf = await upload(pdf, ruta)
    }
    await cursoFound.save()
    return res.status(200).send('Modificado correctamente')
}