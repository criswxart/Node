var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var tipoSchema = new Schema({

    nombre: { type: String, unique: true, required: [true, ' El nombre del tipo es necesario ']  },
    profesional: { type: Schema.Types.ObjectId, ref:'Profesional', required:true }

}, {collection: 'tipos'});

module.exports = mongoose.model('Tipo', tipoSchema);