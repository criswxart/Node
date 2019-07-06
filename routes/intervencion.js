var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

var Intervencion = require('../models/intervencion');

// ==========================================
// Obtener todos los Intervenciones
// ==========================================
app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Intervencion.find({})
    .skip(desde)
    .limit(5)
    .populate('tipo')   
    .populate('profesional','nombre especialidad role')
        .exec(
            (err, intervenciones) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al cargar las intervenciones',
                        errors: err
                    });
                }

                Intervencion.count({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        intervenciones,
                        total:conteo
                     });
                });
         });
});


// ==========================================
// Actualizar intervenciones
// ==========================================

app.put('/:id',mdAutenticacion.verificaToken, (req, res)=>{

    var id = req.params.id;
    var body = req.body

    Intervencion.findById( id, (err, intervencion)=> {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar los intervenciones',
                errors: err
            });
        }
        if (!intervencion) {
            return res.status(400).json({
                ok: false,
                mensaje: 'La intervención con el' + id + 'no existe',
                errors: {message: 'No existe la intervención con este ID'}
            });
        }
        intervencion.objetivoSesion = body.objetivoSesion;
        intervencion.descripcion = body.descripcion;
        intervencion.fecha = body.fecha;
        intervencion.tipointervencion = body.tipointervencion;


        intervencion.save((err, intervencionGuardado)=>{

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar la intervención',
                    errors: err
                });
            }
          
            res.status(201).json({
                ok: true,
                intervencion: intervencionGuardado,
            });
        })
    })
})


// ==========================================
// Crear una nueva intervención
// ==========================================
app.post('/', mdAutenticacion.verificaToken,(req, res) => {

    var body = req.body;

    var intervencion = new Intervencion({
        objetivoSesion: body.objetivoSesion,
        descripcion:body.descripcion,
        fecha:body.fecha,
        tipo: body.tipo,
        profesional: req.profesional._id
    });

    intervencion.save((err, intervencionGuardada) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear la intervencion',
                errors: err
            });
        }     
        
        res.status(200).json({
            ok: true,
            intervencion: intervencionGuardada
        });
    });

});

// ==========================================
// Eliminar un plan por su id
// ==========================================

app.delete('/:id', mdAutenticacion.verificaToken, (req, res)=>{

    var id = req.params.id;

    Intervencion.findByIdAndRemove(id, (err, intervencionBorrado)=>{

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar la intervención',
                errors: err
            });
        }

        if (!intervencionBorrado) {
            return res.status(500).json({
                ok: false,
                mensaje: 'La intervención con el' + id + 'no existe',
                errors: {message: 'No existe una intervención con este ID'}
            });
        }

        res.status(200).json({
            ok: true,
            intervencion: intervencionBorrado
        });     
    })
});

module.exports = app;