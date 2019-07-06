var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

var Rescate = require('../models/rescate');

// ==========================================
// Obtener todos los rescatees
// ==========================================
app.get('/', (req, res, next) => {
    Rescate.find({})
        .exec(
            (err, rescates) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al cargar el rescate',
                        errors: err
                    });
                }
                res.status(200).json({
                    ok: true,
                    rescates
                 });
         });
});


// ==========================================
// Actualizar rescates
// ==========================================

app.put('/:id',mdAutenticacion.verificaToken, (req, res)=>{

    var id = req.params.id;
    var body = req.body

    Rescate.findById( id, (err, rescate)=> {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar los rescatees',
                errors: err
            });
        }
        if (!rescate) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El rescate con el' + id + 'no existe',
                errors: {message: 'No existe el rescate con este ID'}
            });
        }
        rescate.tipoRescate = body.tipoRescate;
        rescate.fecha = body.fecha;

        rescate.save((err, rescateGuardado)=>{

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar el rescate',
                    errors: err
                });
            }
          
            res.status(201).json({
                ok: true,
                rescate: rescateGuardado,
            });
        })
    })
})


// ==========================================
// Crear un nuevo rescate
// ==========================================
app.post('/', mdAutenticacion.verificaToken,(req, res) => {

    var body = req.body;

    var rescate = new Rescate({
        tipoRescate: body.tipoRescate,
        fecha:body.fecha,
        trabajador: req.trabajador._id
    });

    rescate.save((err, rescateGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear rescate',
                errors: err
            });
        }     
        
        res.status(200).json({
            ok: true,
            rescate: rescateGuardado
        });
    });

});

// ==========================================
// Eliminar un rescate por su id
// ==========================================

app.delete('/:id', mdAutenticacion.verificaToken, (req, res)=>{

    var id = req.params.id;

    Rescate.findByIdAndRemove(id, (err, rescateBorrado)=>{

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar el rescate',
                errors: err
            });
        }

        if (!rescateBorrado) {
            return res.status(500).json({
                ok: false,
                mensaje: 'El rescate con el' + id + 'no existe',
                errors: {message: 'No existe un rescate con este ID'}
            });
        }

        res.status(200).json({
            ok: true,
            rescate: rescateBorrado
        });     
    })
});

module.exports = app;