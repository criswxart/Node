var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

var Plan = require('../models/plan');

// ==========================================
// Obtener todos los planes
// ==========================================
app.get('/', (req, res, next) => {
    var desde = req.query.desde || 0;
    desde = Number(desde);

    Plan.find({})
    .skip(desde)
    .limit(10)
    .populate('usuario', 'nombre')
        .exec(
            (err, planes) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al cargar el plan',
                        errors: err
                    });
                }
               Plan.count({}, (err, conteo)=>{
                res.status(200).json({
                    ok: true,
                    planes,
                    total: conteo
                 });
               })
         });
});


// ==========================================
// Actualizar planes
// ==========================================

app.put('/:id',mdAutenticacion.verificaToken, (req, res)=>{

    var id = req.params.id;
    var body = req.body

    Plan.findById( id, (err, plan)=> {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar los planes',
                errors: err
            });
        }
        if (!plan) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El plan con el' + id + 'no existe',
                errors: {message: 'No existe el plan con este ID'}
            });
        }
        plan.tipoPlan = body.tipoPlan;
        plan.objetivos = body.objetivos;
        plan.fechaInicio = body.fechaInicio;
        plan.fechaFin = body.fechaFin;
        plan.observaciones = body.observaciones;
        plan.estado = body.estado;
        plan.usuario = body.usuario;


        plan.save((err, planGuardado)=>{

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar el plan',
                    errors: err
                });
            }
          
            res.status(201).json({
                ok: true,
                plan: planGuardado,
            });
        })
    })
})


// ==========================================
// Crear un nuevo plan
// ==========================================
app.post('/', mdAutenticacion.verificaToken,(req, res) => {

    var body = req.body;

    var plan = new Plan({
        tipoPlan: body.tipoPlan,
        objetivos:body.objetivos,
        fechaInicio:body.fechaInicio,
        fechaFin: body.fechaFin,
        observaciones: body.observaciones,
        estado: body.estado,
        usuario: body.usuario,
        profesional: req.profesional._id
    });

    plan.save((err, planGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear plan',
                errors: err
            });
        }     
        
        res.status(200).json({
            ok: true,
            plan: planGuardado
        });
    });

});

// ==========================================
// Eliminar un plan por su id
// ==========================================

app.delete('/:id', mdAutenticacion.verificaToken, (req, res)=>{

    var id = req.params.id;

    Plan.findByIdAndRemove(id, (err, planBorrado)=>{

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar el plan',
                errors: err
            });
        }

        if (!planBorrado) {
            return res.status(500).json({
                ok: false,
                mensaje: 'El plan con el' + id + 'no existe',
                errors: {message: 'No existe un plan con este ID'}
            });
        }

        res.status(200).json({
            ok: true,
            plan: planBorrado
        });     
    })
});

module.exports = app;