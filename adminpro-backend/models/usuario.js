var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var usuarioSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es obligatorio'] },
    correo: { type: String, unique: true, required: [true, 'El correo es obligatorio'] },
    pasword: { type: String, required: [true, 'La contraseña es obligatorio'] },
    img: { type: String, required: false },
    role: { type: String, required: true, default: 'USER_ROLE' }
});

module.exports = mongoose.model('usuario', usuarioSchema);