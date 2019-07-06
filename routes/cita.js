var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

var Cita = require('../models/cita');

// ==========================================
// Obtener todos los citas
// ==========================================
app.get('/', (req, res, next) => {
    Cita.find({})
        .exec(
            (err, citas) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al cargar la cita',
                        errors: err
                    });
                }
                res.status(200).json({
                    ok: true,
                    citas
                 });
         });
});


// ==========================================
// Actualizar citas
// ==========================================

app.put('/:id',mdAutenticacion.verificaToken, (req, res)=>{

    var id = req.params.id;
    var body = req.body

    Cita.findById( id, (err, cita)=> {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar los citas',
                errors: err
            });
        }
        if (!cita) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El cita con el' + id + 'no existe',
                errors: {message: 'No existe el cita con este ID'}
            });
        }
        cita.estado = body.estado;
        cita.fecha = body.fecha;
        cita.hora = body.hora;
        


        cita.save((err, planGuardado)=>{

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar el cita',
                    errors: err
                });
            }
          
            res.status(201).json({
                ok: true,
                cita: planGuardado,
            });
        })
    })
})


// ==========================================
// Crear un nuevo cita
// ==========================================
app.post('/', mdAutenticacion.verificaToken,(req, res) => {

    var body = req.body;

    var cita = new Cita({
        estado: body.estado,
        fecha:body.fecha,
        hora:body.hora,
        trabajador: req.trabajador._id
    });

    cita.save((err, citaGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear cita',
                errors: err
            });
        }     
        
        res.status(200).json({
            ok: true,
            cita: citaGuardado
        });
    });

});

// ==========================================
// Eliminar un cita por su id
// ==========================================

app.delete('/:id', mdAutenticacion.verificaToken, (req, res)=>{

    var id = req.params.id;

    Cita.findByIdAndRemove(id, (err, citaBorrado)=>{

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar el cita',
                errors: err
            });
        }

        if (!citaBorrado) {
            return res.status(500).json({
                ok: false,
                mensaje: 'El cita con el' + id + 'no existe',
                errors: {message: 'No existe un cita con este ID'}
            });
        }

        res.status(200).json({
            ok: true,
            cita: citaBorrado
        });     
    })
});

module.exports = app;