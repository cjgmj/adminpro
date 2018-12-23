var express = require('express');
var app = express();
var Hospital = require('../models/hospital');
var Medico = require('../models/Medico');
var Usuario = require('../models/usuario');

// ===============================
// Búsqueda colección
// ===============================
app.get('/coleccion/:tabla/:busqueda', (req, res) => {
    var tabla = req.params.tabla;
    var regex = new RegExp(req.params.busqueda, 'i');
    var promesa;

    switch (tabla) {
        case 'usuarios':
            promesa = buscarUsuarios(regex);
            break;
        case 'medicos':
            promesa = buscarMedicos(regex);
            break;
        case 'hospitales':
            promesa = buscarHospitales(regex);
            break;
        default:
            return res.status(400).json({
                ok: false,
                mensaje: 'Colección no encontrada',
                error: { message: 'Colección no encontrada' }
            });
    }

    promesa.then(data => {
        res.status(200).json({
            ok: true,
            [tabla]: data
        });
    })
});

// ===============================
// Búsqueda simúltanea
// ===============================
app.get('/todo/:busqueda', (req, res) => {
    var regex = new RegExp(req.params.busqueda, 'i');

    Promise.all([buscarHospitales(regex), buscarMedicos(regex), buscarUsuarios(regex)]).then(respuestas => {
        res.status(200).json({
            ok: true,
            hospitales: respuestas[0],
            medicos: respuestas[1],
            usuarios: respuestas[2]
        });
    });
});

function buscarHospitales(regex) {
    return new Promise((resolve, reject) => {
        Hospital.find({ nombre: regex }).populate('usuario', 'nombre email').exec((err, hospitales) => {
            if (err) {
                reject('Error al cargar hospitales', err);
            }
            resolve(hospitales);
        });
    });
}

function buscarMedicos(regex) {
    return new Promise((resolve, reject) => {
        Medico.find({ nombre: regex }).populate('usuario', 'nombre email').populate('hospital').exec((err, medicos) => {
            if (err) {
                reject('Error al cargar médicos', err);
            }
            resolve(medicos);
        });
    });
}

function buscarUsuarios(regex) {
    return new Promise((resolve, reject) => {
        Usuario.find({}, 'nombre email role').or([{ 'nombre': regex }, { 'email': regex }]).exec((err, usuarios) => {
            if (err) {
                reject('Error al cargar médicos', err);
            }
            resolve(usuarios);
        });
    });
}

module.exports = app;