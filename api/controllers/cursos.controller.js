import { Curso, Capitulo } from '../models/curso.model.js'
import { upload, getFileURL } from '../aws/s3.js'

// Cursos
export const cursos = async (req, res) => {
    try {
        const { limit } = req.query || 0
        const cursos = await Curso.find().limit(limit)
        if (cursos.length == 0) return res.status(400).send('No hay cursos');
        for (const curso of cursos) {
            if (curso.pdf) {
                const tmp = curso.pdf
                curso.pdf = await getFileURL(tmp)
            }
        }
        return res.status(200).send(cursos)
    } catch (error) {
        console.log(error)
        return res.status(500).send('Ocurrio un error')
    }
}

export const cursosPagination = async (req, res) => {
    try {
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
    } catch (error) {
        console.log(error)
        return res.status(500).send('Ocurrio un error')
    }
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
        return res.status(500).send('Ocurrio un error')
    }
}

export const editarCurso = async (req, res) => {
    const { idcurso } = req.params
    const { titulo, descripcion } = req.body
    try {
        const cursoFound = await Curso.findByIdAndUpdate(
            idcurso,
            { titulo, descripcion },
            { new: true }
        )
        if (!cursoFound) return res.status(404).send('No encontrado');
        return res.status(200).send('Modificado correctamente')
    } catch (error) {
        console.log(error)
        return res.status(500).send('Ocurrio un error')
    }
}


export const cursosCapitulosPagination = async (req, res) => {
    try {
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
    } catch (error) {
        console.log(error);
        return res.status(500).send('Ocurrio un error')
    }
}

export const buscarCursos = async (req, res) => {
    try {
        const { idcurso } = req.params
        const cursoFound = await Curso.findById(idcurso)
        if (!cursoFound) return res.status(404).send('No encontrado');
        const capitulos = cursoFound.capitulos
        for (const capitulo of Array.isArray(capitulos) ? capitulos : [capitulos]) {
            if (capitulo?.pdf) {
                const tmp = capitulo.pdf
                capitulo.pdf = await getFileURL(tmp)
            }
        }
        return res.status(200).send(cursoFound)
    } catch (error) {
        console.log(error);
        return res.status(500).send('Ocurrio un error')
    }

}


// Contenido
export const crearCapituloCurso = async (req, res) => {
    try {
        const { idcurso } = req.params
        const { titulo, youtube } = req.body
        const cursoFound = await Curso.findById(idcurso)
        if (!cursoFound) return res.status(404).send('No encontrado');
        const newCapitulo = new Capitulo({
            titulo: titulo,
            idYoutube: youtube
        })
        if (req.files && req.files.pdf) {
            const { pdf } = req.files
            const ruta = `cursos/${cursoFound._id}/${newCapitulo._id}/${pdf.name}`
            await upload(pdf, ruta,'application/pdf')
            newCapitulo.pdf = ruta
        }
        cursoFound.capitulos.push(newCapitulo)
        await cursoFound.save()
        return res.status(200).send('OK')
    } catch (error) {
        console.log(error);
        return res.status(500).send('Ocurrio un error')
    }
}

export const buscarContenidoDelCurso = async (req, res) => {
    try {
        const { idcurso } = req.params
        const cursoFound = await Curso.findById(idcurso)
        if (!cursoFound) return res.status(404).send('No encontrado');
        return res.status(200).send(cursoFound.capitulos)
    } catch (error) {
        console.log(error);
        return res.status(500).send('Ocurrio un error')
    }
}

export const buscarCapituloEspecifico = async (req, res) => {
    try {
        const { idcurso, idcapitulo } = req.params
        const cursoFound = await Curso.findById(idcurso)
        if (!cursoFound) return res.status(404).send('No encontrado');
        console.log(idcapitulo, idcurso);
    
        const contenidoFound = cursoFound.capitulos.find((capitulo) => capitulo._id.toString() === idcapitulo)
        if (!contenidoFound) return res.status(404).send('Capitulo no encontrado');
        if (contenidoFound.pdf) {
            const tmp = contenidoFound.pdf
            contenidoFound.pdf = await getFileURL(tmp)
        }
        return res.status(200).send(contenidoFound)
    } catch (error) {
        console.log(error);
        return res.status(500).send('Ocurrio un error')
    } 
}

export const editarCapituloCurso = async (req, res) => {
    try {
        const { idcurso, idcapitulo } = req.params
        const { titulo, youtube } = req.body
        const cursoFound = await Curso.findById(idcurso)
        if (!cursoFound) return res.status(404).send('No encontrado');
        const contenidoFound = cursoFound.capitulos.find((capitulo) => capitulo._id.toString() === idcapitulo)
        if (!contenidoFound) return res.status(404).send('Capitulo no encontrado');
        contenidoFound.titulo = titulo && titulo
        contenidoFound.idYoutube = youtube && youtube
        if (req.files && req.files.pdf) {
            const { pdf } = req.files
            const ruta = `cursos/${cursoFound._id}/${contenidoFound._id}/${pdf.name}`
            contenidoFound.pdf = await upload(pdf, ruta, 'application/pdf')
        }
        await cursoFound.save()
        return res.status(200).send('Modificado correctamente')
    } catch (error) {
        console.log(error);
        return res.status(500).send('Ocurrio un error')
    }
}


export const ordenarCapitulos = async (req, res) => {
    try {
        const { idcurso } = req.params
        const { indexSeleccionado, indexInsertar } = req.body
        const cursoFound = await Curso.findById(idcurso)
        const newItems = [...cursoFound.capitulos];
        const [draggedItem] = newItems.splice(indexSeleccionado, 1);
        newItems.splice(indexInsertar, 0, draggedItem)
        cursoFound.capitulos = newItems
        await cursoFound.save()
        return res.status(200).send(newItems)
    } catch (error) {
        console.log(error);
        return res.status(500).send('Ocurrio un error')
    }  
}