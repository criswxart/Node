var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var SEED = require('../config/config').SEED;

var app = express();
var Profesional = require('../models/profesional');


var mdAutenticacion = require('../middlewares/autenticacion');

// ==========================================
//  Renovar Token
// ==========================================
app.get('/renuevatoken', mdAutenticacion.verificaToken, (req, res) => {

    var token = jwt.sign({ profesional: req.profesional }, SEED, { expiresIn: 14400 }); // 4 horas

    res.status(200).json({
        ok: true,
        token: token
    });

});


// ==========================================
//  Autenticación normal
// ==========================================
app.post('/', (req, res) => {

    var body = req.body;

    Profesional.findOne({ email: body.email }, (err, profesionalDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar el profesional',
                errors: err
            });
        }

        if (!profesionalDB) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - email',
                errors: err
            });
        }

        if (!bcrypt.compareSync(body.password, profesionalDB.password)) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - password',
                errors: err
            });
        }

        // Crear un token!!!
        profesionalDB.password = ':)';

        var token = jwt.sign({ profesional: profesionalDB }, SEED, { expiresIn: 14400 }); // 4 horas

        res.status(200).json({
            ok: true,
            profesional: profesionalDB,
            token: token,
            id: profesionalDB._id,
            menu: obtenerMenu(profesionalDB.role)
        });

    })


});



function obtenerMenu(ROLE) {

    var menu = [{
            titulo: 'Principal',
            icono: 'mdi mdi-gauge',
            submenu: [
                { titulo: 'Dashboard', url: '/dashboard' },
                { titulo: 'ProgressBar', url: '/progress' },
                { titulo: 'Gráficas', url: '/graficas1' },
                { titulo: 'Promesas', url: '/promesas' },
                { titulo: 'RxJs', url: '/rxjs' },
                { titulo: 'intervencion', url: '/intervenciones' }

            ]
        },
        {
            titulo: 'Mantenimientos',
            icono: 'mdi mdi-folder-lock-open',
            submenu: [
                // { titulo: 'Usuarios', url: '/usuarios' },
                { titulo: 'Hospitales', url: '/hospitales' },
                { titulo: 'Médicos', url: '/medicos' },
                { titulo: 'Usuarios', url: '/usuarios' },
                { titulo: 'Planes', url: '/planes' },
                { titulo: 'Tipos intervenciones', url: '/tipos' }

            ]
        }
    ];

    console.log('ROLE', ROLE);

    if (ROLE === 'ADMIN_ROLE') {
        menu[1].submenu.unshift({ titulo: 'Profesionales', url: '/profesionales' });

    }


    return menu;

}



module.exports = app;
