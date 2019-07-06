var express = require('express');
var bcrypt = require('bcryptjs');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

var Profesional = require('../models/profesional');

// ==========================================
// Obtener todos los Profesionales
// ==========================================
app.get('/', (req, res, next) => {
    Profesional.find({}, 'nombre apellidos especialidad telefono img role')
        .exec(
            (err, profesionales) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando profesionales',
                        errors: err
                    });
                }
                res.status(200).json({
                    ok: true,
                    profesionales
                 });
         });
});


// ==========================================
// Actualizar trabajadores
// ==========================================

app.put('/:id',mdAutenticacion.verificaToken, (req, res)=>{

    var id = req.params.id;
    var body = req.body

    Profesional.findById( id, (err, profesional)=> {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar profesional',
                errors: err
            });
        }
        if (!profesional) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El profesional con el' + id + 'no existe',
                errors: {message: 'No existe un profesional con este ID'}
            });
        }
        profesional.nombre = body.nombre;
        profesional.apellidos = body.apellidos;
        profesional.especialidad = body.especialidad;
        profesional.telefono = body.telefono;
        profesional.email = body.email;
        profesional.role = body.role;

        profesional.save((err, profesionalGuardado)=>{

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar al profesional',
                    errors: err
                });
            }
            profesionalGuardado.password = 'GG';

            res.status(201).json({
                ok: true,
                profesional: profesionalGuardado,
            });
        })
    })
})


// ==========================================
// Crear un nuevo trabajador
// ==========================================
app.post('/', (req, res) => {

    var body = req.body;

    var profesional = new Profesional({
        nombre: body.nombre,
        apellidos: body.apellidos,
        especialidad: body.especialidad,
        telefono: body.telefono,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    });

    profesional.save((err, profesionalGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear profesional',
                errors: err
            });
        }     
        
        res.status(200).json({
            ok: true,
            profesional: profesionalGuardado,
            profesionalToken: req.profesional
        });
    });

});

// ==========================================
// Eliminar un trabajador por su id
// ==========================================

app.delete('/:id', mdAutenticacion.verificaToken, (req, res)=>{

    var id = req.params.id;

    Profesional.findByIdAndRemove(id, (err, profesionalBorrado)=>{

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar profesional',
                errors: err
            });
        }

        if (!profesionalBorrado) {
            return res.status(500).json({
                ok: false,
                mensaje: 'El profesional con el' + id + 'no existe',
                errors: {message: 'No existe un profesional con este ID'}
            });
        }

        res.status(200).json({
            ok: true,
            profesional: profesionalBorrado,
        });     
    })
});

module.exports = app;