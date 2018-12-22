var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var app = express();
var Usuario = require('../models/usuario');

app.post('/', (req, res) => {
    var body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {
        if (err) {
            return response.status(500).json({
                ok: false,
                mensaje: 'Error en base de datos',
                errors: error
            });
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Usuario incorrecto',
                errors: { message: 'Usuario incorrecto' }
            });
        }

        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Contraseña incorrecta',
                errors: { message: 'Contraseña incorrecta' }
            });
        }

        usuarioDB.password = null;

        // Crear token
        var token = jwt.sign({ usuario: usuarioDB }, '@-seed-@-example', { expiresIn: 14400 });

        return res.status(200).json({
            ok: true,
            mensaje: 'Login correcto',
            usuario: usuarioDB,
            token: token,
            id: usuarioDB.id
        });
    });
})

module.exports = app;