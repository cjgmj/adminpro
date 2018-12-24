var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var app = express();
var Usuario = require('../models/usuario');
var SEED = require('../config/config').SEED;

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

app.post('/google', async(req, res) => {
    var token = req.body.token;

    var googleUser = await verify(token).catch(e => {
        res.status(403).json({
            ok: false,
            mensaje: 'Token no válido'
        });
    });

    res.status(200).json({
        ok: true,
        mensaje: 'Petición realizada correctamente',
        googleUser: googleUser
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
            id: usuarioDB.id
        });
    });
});

module.exports = app;