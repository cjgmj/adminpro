var express = require('express');
var app = express();
var Medico = require('../models/Medico');
var mdAutenticacion = require('../middlewares/autenticacion');

// ===============================
// Obtener médicos
// ===============================
app.get('/', (req, res) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);
    var limite = req.query.limite || 5;
    limite = Number(limite);

    Medico.find({}).populate('usuario', 'nombre email').populate('hospital').skip(desde).limit(limite)
        .exec((err, medicos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error en base de datos',
                    errors: err
                });
            }

            Medico.count({}, (err, cont) => {
                return res.status(200).json({
                    ok: true,
                    medicos: medicos,
                    total: cont
                });
            });
        });
});

// ===============================
// Actualizar médico
// ===============================
app.put('/:id', mdAutenticacion.verifyToken, (req, res) => {
    var id = req.params.id;

    Medico.findById(id, (err, medico) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error en la búsqueda del medico',
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

        var body = req.body;
        medico.nombre = medico.nombre;
        medico.usuario = req.usuario._id;
        medico.hospital = body.hospital;


        medico.save((err, medicoGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar medico',
                    errors: err
                });
            }

            return res.status(200).json({
                ok: true,
                medico: medicoGuardado
            });
        });
    });
});

// ===============================
// Crear médico
// ===============================
app.post('/', mdAutenticacion.verifyToken, (req, res) => {
    var body = req.body;

    var medico = new Medico({
        nombre: body.nombre,
        img: body.img,
        usuario: req.usuario._id,
        hospital: body.hospital
    });

    medico.save((err, medicoGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear medico',
                errors: err
            });
        }

        return res.status(201).json({
            ok: true,
            medico: medicoGuardado
        });
    });
});

// ===============================
// Borrar médico
// ===============================
app.delete('/:id', mdAutenticacion.verifyToken, (req, res) => {
    var id = req.params.id;

    Medico.findByIdAndRemove(id, (err, medicoBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error borrando el medico',
                errors: err
            });
        }

        if (!medicoBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El medico no existe',
                errors: { message: 'El medico no existe' }
            });
        }

        return res.status(200).json({
            ok: true,
            medico: medicoBorrado
        });
    });
});

module.exports = app;