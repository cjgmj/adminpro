var express = require('express');
var bcrypt = require('bcryptjs');
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
        password: bcrypt.hashSync(body.password, 10),
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

// ===============================
// Actualizar usuario
// ===============================
app.put('/:id', (req, res) => {
    var id = req.params.id;

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

        var body = req.body;
        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.role = body.role;

        usuario.save((err, usuarioGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar usuario',
                    errors: err
                });
            }

            usuarioGuardado.password = null;

            return res.status(200).json({
                ok: true,
                usuario: usuarioGuardado
            });
        });
    });
});

module.exports = app;