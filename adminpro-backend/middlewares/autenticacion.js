var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;

// ===============================
// Verificar token
// ===============================
exports.verifyToken = function(req, res, next) {
    var token = req.query.token;

    jwt.verify(token, SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                mensaje: 'Autenticación fallida',
                errors: err
            });
        }

        req.usuario = decoded.usuario;

        next();
    });
};

// ===============================
// Verificar administrador
// ===============================
exports.verifyAdmin = function(req, res, next) {
    var usuario = req.usuario;

    if (usuario.role !== 'ADMIN_ROLE') {
        return res.status(401).json({
            ok: false,
            mensaje: 'No tiene permisos',
            errors: { message: 'No tiene permisos' }
        });
    } else {
        next();
    }
};

// ===============================
// Verificar administrador o mismo usuario
// ===============================
exports.verifyAdminOrMe = function(req, res, next) {
    var usuario = req.usuario;
    var id = req.params.id;

    if (!(usuario.role === 'ADMIN_ROLE' || usuario._id === id)) {
        return res.status(401).json({
            ok: false,
            mensaje: 'No tiene permisos',
            errors: { message: 'No tiene permisos' }
        });
    } else {
        next();
    }
};