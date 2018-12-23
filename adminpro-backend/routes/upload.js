var express = require('express');
var fileUpload = require('express-fileupload');
var app = express();

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

        res.status(200).json({
            ok: true,
            mensaje: 'Archivo subido correctamente'
        });
    });
});

module.exports = app;