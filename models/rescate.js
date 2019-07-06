var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var rescateSchema = new Schema({

    tipoRescate: { type: String, required: [true, ' El tipo es necesario ']  },
    fecha: { type: Date, required: [true, 'La fecha es necesario ']  },
    profesional: { type: Schema.Types.ObjectId, ref:'Profesional' }
}, {collection: 'rescates'});

module.exports = mongoose.model('Rescate', rescateSchema);