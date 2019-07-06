var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var intervencionSchema = new Schema({

    objetivoSesion: { type: String, required: [true, ' El objetivo es necesario ']  },
    descripcion: { type: String, required: [true, ' La descripcion es necesario ']  },
    fecha: { type: Date, required: [true, 'La fecha es necesario ']  },
    tipo: { type: Schema.Types.ObjectId, ref:'Tipo', required:true },
    profesional: { type: Schema.Types.ObjectId, ref:'Profesional', required:true }

   
}, {collection: 'intervenciones'});

module.exports = mongoose.model('Intervencion', intervencionSchema);