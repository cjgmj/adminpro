var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;
var Usuario = require('../models/usuario');
var mdAutenticacion = require('../middlewares/autenticacion');
var app = express();

// Google
var CLIENT_ID = require('../config/config').CLIENT_ID;
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);

// ===============================
// Autenticación Google
// ===============================
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID
    });
    const payload = ticket.getPayload();

    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    };
}

// ===============================
// Autenticación Google
// ===============================
app.get('/refreshToken', mdAutenticacion.verifyToken, (req, res) => {

    var token = jwt.sign({ usuario: req.usuario }, SEED, { expiresIn: 14400 });

    res.status(200).json({
        ok: true,
        token: token
    });
});

app.post('/google', async(req, res) => {
    var token = req.body.token;

    var googleUser = await verify(token).catch(e => {
        res.status(403).json({
            ok: false,
            mensaje: 'Token no válido'
        });
    });

    Usuario.findOne({ email: googleUser.email }, (err, usuarioDB) => {
        if (err) {
            return response.status(500).json({
                ok: false,
                mensaje: 'Error en base de datos',
                errors: error
            });
        }

        if (usuarioDB) {
            if (!usuarioDB.google) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Debe usar su autenticación normal',
                    errors: { message: 'Debe usar su autenticación normal' }
                });
            }

            var token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 14400 });

            return res.status(200).json({
                ok: true,
                mensaje: 'Login correcto',
                usuario: usuarioDB,
                token: token,
                id: usuarioDB.id,
                menu: obtenerMenu(usuarioDB.role)
            });
        }

        // El usuario no existe en BDD
        var usuario = new Usuario({
            nombre: googleUser.nombre,
            email: googleUser.email,
            img: googleUser.img,
            google: true,
            password: null
        });

        usuario.save((err, usuarioDB) => {
            if (err) {
                return response.status(500).json({
                    ok: false,
                    mensaje: 'Error en base de datos',
                    errors: error
                });
            }

            var token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 14400 });

            return res.status(200).json({
                ok: true,
                mensaje: 'Login correcto',
                usuario: usuarioDB,
                token: token,
                id: usuarioDB.id,
                menu: obtenerMenu(usuarioDB.role)
            });
        });
    });
});

// ===============================
// Autenticación normal
// ===============================
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
        var token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 14400 });

        return res.status(200).json({
            ok: true,
            mensaje: 'Login correcto',
            usuario: usuarioDB,
            token: token,
            id: usuarioDB.id,
            menu: obtenerMenu(usuarioDB.role)
        });
    });
});

function obtenerMenu(role) {
    var menu = [{
        titulo: 'Principal',
        icono: 'mdi mdi-gauge',
        submenu: [
            { titulo: 'Dashboard', url: '/dashboard' },
            { titulo: 'ProgressBar', url: '/progress' },
            { titulo: 'Gráficas', url: '/graficas1' },
            { titulo: 'Promesas', url: '/promesas' },
            { titulo: 'Rxjs', url: '/rxjs' }
        ]
    }, {
        titulo: 'Gestión',
        icono: 'mdi mdi-folder-lock-open',
        submenu: [
            // { titulo: 'Usuarios', url: '/usuarios' },
            { titulo: 'Hospitales', url: '/hospitales' },
            { titulo: 'Médicos', url: '/medicos' }
        ]
    }];

    if (role === 'ADMIN_ROLE') {
        // unshift lo añade al principio y push al final
        menu[1].submenu.unshift({ titulo: 'Usuarios', url: '/usuarios' });
    }

    return menu;
}

module.exports = app;