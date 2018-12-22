var express = require('express');
var app = express();
var Usuario = require('../models/usuario');

// ===============================
// Obtener usuarios
// ===============================
app.get('/', (request, response, next) => {
    Usuario.find({}, 'nombre email img role').exec(
        (error, usuarios) => {
            if (error) {
                return response.status(500).json({
                    ok: false,
                    mensaje: 'Error en base de datos',
                    errors: error
                });
            }

            return response.status(200).json({
                ok: true,
                usuarios: usuarios
            });
        });
});

// ===============================
// Crear usuario
// ===============================
app.post('/', (request, response) => {
    var body = request.body;
    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: body.password,
        img: body.img,
        role: body.role
    });

    usuario.save((error, usuarioGuardado) => {
        if (error) {
            return response.status(400).json({
                ok: false,
                mensaje: 'Error al crear usuario',
                errors: error
            });
        }

        return response.status(201).json({
            ok: true,
            usuario: usuarioGuardado
        });
    });
});

module.exports = app;