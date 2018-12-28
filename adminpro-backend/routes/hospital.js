var express = require('express');
var app = express();
var Hospital = require('../models/hospital');
var mdAutenticacion = require('../middlewares/autenticacion');

// ===============================
// Obtener hospitales
// ===============================
app.get('/', (req, res) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);
    var limite = req.query.limite || 5;
    limite = Number(limite);

    Hospital.find({}).populate('usuario', 'nombre email').skip(desde).limit(limite)
        .exec((err, hospitales) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error en base de datos',
                    errors: err
                });
            }

            Hospital.count({}, (err, cont) => {
                return res.status(200).json({
                    ok: true,
                    hospitales: hospitales,
                    total: cont
                });
            });
        });
});

// ==========================================
// Obtener hospital por ID
// ==========================================
app.get('/:id', (req, res) => {
    var id = req.params.id;
    Hospital.findById(id).populate('usuario', 'nombre img email')
        .exec((err, hospital) => {
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
            res.status(200).json({
                ok: true,
                hospital: hospital
            });
        });
});

// ===============================
// Actualizar hospital
// ===============================
app.put('/:id', mdAutenticacion.verifyToken, (req, res) => {
    var id = req.params.id;

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

        var body = req.body;
        hospital.nombre = body.nombre;
        hospital.usuario = req.usuario._id;

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
                hospital: hospitalGuardado
            });
        });
    });
});

// ===============================
// Crear hospital
// ===============================
app.post('/', mdAutenticacion.verifyToken, (req, res) => {
    var body = req.body;

    var hospital = new Hospital({
        nombre: body.nombre,
        img: body.img,
        usuario: req.usuario._id
    });

    hospital.save((err, hospitalGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear hospital',
                errors: err
            });
        }

        return res.status(201).json({
            ok: true,
            hospital: hospitalGuardado
        });
    });
});

// ===============================
// Borrar hospital
// ===============================
app.delete('/:id', mdAutenticacion.verifyToken, (req, res) => {
    var id = req.params.id;

    Hospital.findByIdAndRemove(id, (err, hospitalBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error borrando el hospital',
                errors: err
            });
        }

        if (!hospitalBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El hospital no existe',
                errors: { message: 'El hospital no existe' }
            });
        }

        return res.status(200).json({
            ok: true,
            hospital: hospitalBorrado
        });
    });
});

module.exports = app;