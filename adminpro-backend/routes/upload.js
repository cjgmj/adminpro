var express = require('express');
var fileUpload = require('express-fileupload');
var fs = require('fs');
var app = express();
var Hospital = require('../models/hospital');
var Medico = require('../models/Medico');
var Usuario = require('../models/usuario');

app.use(fileUpload());

app.put('/:tipo/:id', (req, res) => {

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No ha seleccionado una imagen',
            errors: { message: 'Debe de seleccionar una imagen' }
        });
    }

    var tipo = req.params.tipo;

    // Tipos de colección
    var tiposValidos = ['hospitales', 'medicos', 'usuarios'];
    if (tiposValidos.indexOf(tipo) === -1) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Tipo no válido',
            errors: { message: 'Las tipos válidos son ' + tiposValidos.join(', ') }
        });
    }

    // Obtener nombre del archivo
    var archivo = req.files.imagen;
    var nombreSplit = archivo.name.split('.');
    var extension = nombreSplit[nombreSplit.length - 1];

    // Sólo se pueden subir estas extensiones
    var extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if (extensionesValidas.indexOf(extension) === -1) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Extensión no válida',
            errors: { message: 'Las extensiones válidas son ' + extensionesValidas.join(', ') }
        });
    }

    var id = req.params.id;

    // Nombre de archivo personalizado
    var nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;

    // Mover el archivo del temporal a un path
    var path = `./uploads/${tipo}/${nombreArchivo}`;

    archivo.mv(path, err => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al subir archivo',
                errors: err
            });
        }

        subirPorTipo(tipo, id, nombreArchivo, res);
    });
});

function subirPorTipo(tipo, id, nombreArchivo, res) {
    if (tipo === 'usuarios') {
        Usuario.findById(id, (err, usuario) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error en la búsqueda del usuario',
                    errors: err
                });
            }

            if (!usuario) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El usuario no existe',
                    errors: { message: 'El usuario no existe' }
                });
            }

            var pathAntiguo = `./uploads/${tipo}/${usuario.img}`;

            if (fs.existsSync(pathAntiguo)) {
                fs.unlinkSync(pathAntiguo);
            }

            usuario.img = nombreArchivo;

            usuario.save((err, usuarioGuardado) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'Error al actualizar usuario',
                        errors: err
                    });
                }

                usuarioGuardado = null;

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen del usuario actualizada',
                    usuario: usuarioGuardado
                });
            });
        });
    } else if (tipo === 'medicos') {
        Medico.findById(id, (err, medico) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error en la búsqueda del médico',
                    errors: err
                });
            }

            if (!medico) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El medico no existe',
                    errors: { message: 'El medico no existe' }
                });
            }

            var pathAntiguo = `./uploads/${tipo}/${medico.img}`;

            if (fs.existsSync(pathAntiguo)) {
                fs.unlinkSync(pathAntiguo);
            }

            medico.img = nombreArchivo;

            medico.save((err, medicoGuardado) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'Error al actualizar médico',
                        errors: err
                    });
                }

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen del médico actualizada',
                    medico: medicoGuardado
                });
            });
        });
    } else {
        Hospital.findById(id, (err, hospital) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error en la búsqueda del hospital',
                    errors: err
                });
            }

            if (!hospital) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El hospital no existe',
                    errors: { message: 'El hospital no existe' }
                });
            }

            var pathAntiguo = `./uploads/${tipo}/${hospital.img}`;

            if (fs.existsSync(pathAntiguo)) {
                fs.unlinkSync(pathAntiguo);
            }

            hospital.img = nombreArchivo;

            hospital.save((err, hospitalGuardado) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'Error al actualizar hospital',
                        errors: err
                    });
                }

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen del médico hospital',
                    hospital: hospitalGuardado
                });
            });
        });
    }
}

module.exports = app;