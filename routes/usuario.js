var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

var Usuario = require('../models/usuario');

// ==========================================
// Obtener todos los Usuarios
// ==========================================
app.get('/', (req, res, next) => {
    var desde = req.query.desde || 0;
    desde = Number(desde);

    Usuario.find({})
    .skip(desde)
    .limit(5)
        .exec(
            (err, usuarios) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al cargar usuarios',
                        errors: err
                    });
                }
                Usuario.count({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        usuarios,
                        total:conteo
                     });
                });
         });
});

// ==========================================
//  Obtener Usuario por ID
// ==========================================
app.get('/:id', (req, res) => {

    var id = req.params.id;

    Usuario.findById(id)
        .exec((err, usuario) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar usuario',
                    errors: err
                });
            }

            if (!usuario) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El usuario con el id ' + id + 'no existe',
                    errors: { message: 'No existe un usuario con ese ID' }
                });
            }
            res.status(200).json({
                ok: true,
                usuario: usuario
            });
        })
})



// ==========================================
// Actualizar Usuarios
// ==========================================

app.put('/:id', mdAutenticacion.verificaToken, (req, res)=>{

    var id = req.params.id;
    var body = req.body

    Usuario.findById( id, (err, usuario)=> {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }
        if (!usuario) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El usuario con el' + id + 'no existe',
                errors: {message: 'No existe un trabajador con este ID'}
            });
        }

        usuario.nombre = body.nombre;
        usuario.apellidos = body.apellidos;
        usuario.direccion = body.direccion;
        usuario.telefono = body.telefono;
        usuario.fechaNac = body.fechaNac;
        usuario.fechaIngreso = body.fechaIngreso;
        usuario.sexo = body.sexo;
        
        usuario.save((err, usuarioGuardado)=>{

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar al usuario',
                    errors: err
                });
            }
            res.status(201).json({
                ok: true,
                usuario: usuarioGuardado
            });
        })
    })
})


// ==========================================
// Crear un nuevo Usuario
// ==========================================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var usuario = new Usuario({
        nombre: body.nombre,
        apellidos: body.apellidos,
        direccion: body.direccion,
        telefono: body.telefono,
        fechaNac: body.fechaNac,
        fechaIngreso: body.fechaIngreso,
        sexo: body.sexo,
        profesional: req.profesional._id

    });

    usuario.save((err, usuarioGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear usuario',
                errors: err
            });
        }     
        
        res.status(200).json({
            ok: true,
            usuario: usuarioGuardado,
        });
    });

});

// ==========================================
// Eliminar un Usuario por su id
// ==========================================

app.delete('/:id', mdAutenticacion.verificaToken, (req, res)=>{

    var id = req.params.id;

    Usuario.findByIdAndRemove(id, (err, usuarioBorrado)=>{

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar usuario',
                errors: err
            });
        }

        if (!usuarioBorrado) {
            return res.status(500).json({
                ok: false,
                mensaje: 'El usuario con el' + id + 'no existe',
                errors: {message: 'No existe un usuario con este ID'}
            });
        }

        res.status(200).json({
            ok: true,
            usuario: usuarioBorrado,
        });     
    })
});

module.exports = app;