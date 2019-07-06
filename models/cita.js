var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var citaSchema = new Schema({

    estado: { type: String, required: [true, ' El estado es necesario ']  },
    fecha: { type: Date, unique: true, required: [true, 'La fecha es necesario ']  },
    hora: { type: Date, unique: true, required: [true, ' La hora es necesario ']  },
    profesional: { type: Schema.Types.ObjectId, ref:'Profesional' }
    
}, {collection: 'citas'});

module.exports = mongoose.model('Cita', citaSchema);