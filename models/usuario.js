var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var usuarioSchema = new Schema({

    nombre: { type: String, required: [true, ' El nombre es necesario ']  },
    apellidos: { type: String, required: [true, ' El apellido es necesario ']  },
    direccion: { type: String, required: [true, ' La dirección es necesario ']  },
    telefono: { type: String, required: [true, ' El telefono es necesario ']  },
    fechaNac: { type: Date, required: [true, 'La fecha de nacimiento es necesario ']  },
    fechaIngreso: { type: Date, required: [true, ' La fecha de ingreso es necesario ']  },
    sexo: { type: String, required: [true, ' El sexo es necesario '] },
    profesional: { type: Schema.Types.ObjectId, ref:'Profesional', required:true }
}, {collection: 'usuarios'});

/* // Establecemos un campo virtual
usuarioSchema.virtual('fecha_nacimiento')
  .set(function(fecha) {
    // El formato esperado es 'yyyy-mm-dd' que es el devuelto por el campo input
    // el valor recibido se almacenará en el campo fecha_nacimiento_iso de nuestro documento
    this.fechaNac = new Date(fecha);
  })
  .get(function(){
    // el valor devuelto será un string en formato 'yyyy-mm-dd'
    return this.fechaNac.toISOString().substring(0,10);

  }); */

module.exports = mongoose.model('Usuario', usuarioSchema);