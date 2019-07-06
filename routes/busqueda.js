var express = require('express');

var app = express();

var Profesional = require('../models/profesional');
var Usuario = require('../models/usuario');

// ==============================
// Busqueda por colección
// ==============================
app.get('/coleccion/:tabla/:busqueda', (req, res) => {

    var busqueda = req.params.busqueda;
    var tabla = req.params.tabla;
    var regex = new RegExp(busqueda, 'i');

    var promesa;

    switch (tabla) {

        case 'usuarios':
            promesa = buscarUsuarios(busqueda, regex);
            break;

        case 'trabajadores':
            promesa = buscarProfesionales(busqueda, regex);
            break;

        default:
            return res.status(400).json({
                ok: false,
                mensaje: 'Los tipos de busqueda sólo son: usuarios, profesionales',
                error: { message: 'Tipo de tabla/coleccion no válido' }
            });

    }

    promesa.then(data => {

        res.status(200).json({
            ok: true,
            [tabla]: data
        });

    })

});


function buscarProfesionales(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Profesional.find({ nombre: regex })
            .populate('profesional', 'nombre email ')
            .exec((err, trabajadores) => {

                if (err) {
                    reject('Error al cargar profesionales', err);
                } else {
                    resolve(profesionales)
                }
            });
    });
}

function buscarUsuarios(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Usuario.find({})
            .or([{ 'nombre': regex }, { 'email': regex }])
            .exec((err, usuarios) => {

                if (err) {
                    reject('Erro al cargar usuarios', err);
                } else {
                    resolve(usuarios);
                }
            })
    });
}

module.exports = app;