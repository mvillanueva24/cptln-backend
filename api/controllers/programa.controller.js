import { getFileURL, upload } from '../aws/s3.js'
import { Programa, Contenido } from '../models/programa.model.js'

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

export const buscarPrograma = async (req, res) => {
    const { id } = req.params
    const ProgramaFound = await Programa.findById(id)
    if (!ProgramaFound) return res.status(404).send('No encontrado')
    const imagenes = ProgramaFound.imagenes
    ProgramaFound.imagenes = []
    for (const imagen of imagenes) {
        const tmp = imagen.ruta
        const ruta = await getFileURL(tmp)
        ProgramaFound.imagenes.push({ ruta: ruta, estado: imagen.estado })
    }
    return res.status(200).send(ProgramaFound)
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

export const buscarProgramaPorNombre = async (req, res) => {
    const { nombre } = req.body
    const customNombre = nombre.replace(/-/g, ' ');
    const ProgramaFound = await Programa.findOne({ titulo: { $regex: new RegExp(`^${customNombre.toLowerCase()}$`, "i") } })
    if (!ProgramaFound) { return res.status(404).send('No encontrado') }
    return res.status(200).send(ProgramaFound)
}

export const buscarProgramaConContenido = async(req, res) => {
    const { nombre } = req.body
    const customNombre = nombre.replace(/-/g, ' ');
    const ProgramaFound = await Programa.findOne({ titulo: { $regex: new RegExp(`^${customNombre.toLowerCase()}$`, "i") } })
    if (!ProgramaFound) return res.status(404).send('No encontrado')
    const contenidos = ProgramaFound.contenido
    console.log(ProgramaFound.contenido);
    for (const contenido of Array.isArray(contenidos) ? contenidos : [contenidos]) {
        const tmp = contenido.imagen
        if (tmp) { // Verificamos si hay una imagen
            contenido.imagen = await getFileURL(tmp); // Obtenemos la URL
        } else {
            contenido.imagen = null; // Si no hay imagen, establecemos como null
        }
    }
    return res.status(200).send(ProgramaFound)
}

export const buscarContenidoProgramaPagination = async (req, res) => {
    const { id } = req.params
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 2
    const ProgramaFound = await Programa.findById(id)
    const contenidoPrograma = await ProgramaFound.contenido.slice((page - 1), (page - 1 + limit))
    const totalContenidoPrograma = ProgramaFound.contenido.length
    if (contenidoPrograma.length == 0) return res.status(400).send('Aun no hay contenido')
    return res.status(200).json({
        contenidoPrograma,
        currentPage: page,
        totalPages: Math.ceil(totalContenidoPrograma / limit),
        totalContenidoPrograma
    })
}

export const buscarContenidoEspecifoPrograma = async(req, res) => {
    const { idprograma, id } = req.params
    const ProgramaFound = await Programa.findById(idprograma)
    if(!ProgramaFound) return res.status(404).send('No encontrado');
    const ContenidoFound = ProgramaFound.contenido.find((contenido) => contenido._id.toString() === id)
    if(!ContenidoFound) return res.status(404).send('Contenido no encontrado');
    if (ContenidoFound.imagen) {
        const tmp = ContenidoFound.imagen
        ContenidoFound.imagen = await getFileURL(tmp)
    }
    return res.status(200).send(ContenidoFound)
}



export const crearPrograma = async (req, res) => {
    const { titulo, categoria, color, abreviatura, descripcion, enlace } = req.body
    try {
        const newPrograma = new Programa({
            titulo: titulo,
            color: color,
            descripcion: descripcion,
            abreviatura: abreviatura,
            categoria: categoria,
            enlace: enlace === undefined ? null : enlace
        })
        if (enlace === "") {
            newPrograma.imagenes = null
            newPrograma.contenido = null
        } else {
            if (req.files) {
                const { imagenes } = req.files
                for (const imagen of Array.isArray(imagenes) ? imagenes : [imagenes]) {
                    const ruta = `programas/${titulo}/${imagen.name}`
                    await upload(imagen, ruta)
                    newPrograma.imagenes.push({
                        ruta: ruta,
                        estado: true,
                        abreviatura: abreviatura
                    })
                }
            }
        }
        await newPrograma.save()
        return res.status(200).send('OK')
    } catch (error) {
        console.log(error);
    }
}

export const agregarContenidoPrograma = async (req, res) => {
    const { id } = req.params
    const { subtitulo, parrafo } = req.body
    const programaFound = await Programa.findById(id)
    const newContenido = new Contenido({
        subtitulo, parrafo
    })
    if (req.files && req.files.imagen) {
        const { imagen } = req.files
        const ruta = `programas/${programaFound.titulo}/contenido/${newContenido._id}/${imagen.name}`
        await upload(imagen, ruta)
        newContenido.imagen = ruta
    }
    programaFound.contenido.push(newContenido)
    await programaFound.save()
}

export const editarPrograma = async (req, res) => {
    const { id } = req.params
    const { titulo, abreviatura, categoria, descripcion, color, enlace, indexHome } = req.body
    console.log(req.body);
    const ProgramaFound = await Programa.findById(id)
    if (!ProgramaFound) { return res.status(200).send('No encontrado') }
    try {
        ProgramaFound.titulo = titulo;
        ProgramaFound.abreviatura = abreviatura;
        ProgramaFound.categoria = categoria;
        ProgramaFound.descripcion = descripcion;
        ProgramaFound.color = color;
        if (enlace === "") {
            
            if (req.files && req.files.imagenes) {
                const { imagenes } = req.files
                ProgramaFound.imagenes = []
                let countIndex = 0
                for (const imagen of imagenes) {
                    const ruta = `programas/${ProgramaFound.titulo}/${imagen.name}`
                    await upload(ruta, imagen)
                    ProgramaFound.imagenes.push({ ruta: ruta, estadoHome: `${countIndex == indexHome ? true : false}` })
                    countIndex++
                }
            }
        } else {
            console.log(`Hola`);
            ProgramaFound.imagenes = []
            ProgramaFound.enlace = enlace
        }
        await ProgramaFound.save()
    } catch (error) {
        console.log(error)
    }
}

export const editarContenidoDePrograma = async (req, res) => {
    const { idprograma, id } = req.params
    console.log('ID Programa: '+idprograma+', ID: '+id);
    const { subtitulo, parrafo } = req.body
    const ProgramaFound = await Programa.findById(idprograma)
    if(!ProgramaFound) return res.status(404).send('No encontrado');
    const ContenidoFound = ProgramaFound.contenido.find((contenido) => contenido._id.toString() === id)
    if(!ContenidoFound) return res.status(404).send('Contenido no encontrado');
    ContenidoFound.subtitulo = subtitulo
    ContenidoFound.parrafo = parrafo
    if (req.files && req.files.imagen) {
        const { imagen } = req.files
        const ruta = `programas/${ProgramaFound.titulo}/contenido/${ContenidoFound._id}/${imagen.name}`
        await upload(imagen, ruta)
        ContenidoFound.imagen = ruta
    }
    ProgramaFound.save()
    return res.status(200).send(ContenidoFound)
}

export const borrarPrograma = async (req, res) => {
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

export const borrarContenido = async(req, res) => {
    const { idprograma, id } = req.params
    const programaFound = await Programa.findById(idprograma)
    if (!programaFound) return res.status(404).send('No encontrado');
    
}