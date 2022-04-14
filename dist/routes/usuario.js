"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const usuario_model_1 = require("../models/usuario.model");
const bcrypt_1 = __importDefault(require("bcrypt"));
const token_1 = __importDefault(require("../classes/token"));
const autenticacion_1 = require("../middlewares/autenticacion");
const userRoutes = (0, express_1.Router)();
// LOGIN
userRoutes.post('/login', (req, res) => {
    // la logica es extraer la informacion del POST, en el post vendria
    // el email y el password 
    // body seria todo el objeto user
    //mongoose tiene un metodo para buscar, pero primero hay que traer el registro
    // por el correo electronico
    //lo primero es tomar el correo electronico que tambien lo usare para buscar el password encryptado
    const body = req.body;
    //LOGIN
    usuario_model_1.Usuario.findOne({ email: body.email }, (err, userDB) => {
        if (err)
            throw err; // si recibo unn error de base de datos no continua
        // si no hay error hay que consultar si el objeto userDB encontro algo, como por ejemplo
        // que se haya escrito un correo que no exista en la base de datos
        if (!userDB) { //si no existe el userDB 
            return res.json({
                ok: false,
                mensaje: 'Usuario/pass no son correctos'
            });
        }
        if (userDB.compararPassword(body.password)) { //si contraseñas son iguales
            const tokenUser = token_1.default.getJwtToken({
                _id: userDB._id,
                nombre: userDB.nombre,
                email: userDB.email,
                avatar: userDB.avatar //avatar del usuario
            });
            res.json({
                ok: true,
                token: tokenUser //aqui pongo el token generado arriba con todo lo que trae
            }); //copio y pego esto para llevarlo al del creacion
        }
        else {
            return res.json({
                ok: false,
                mensaje: 'Usuario/pass no son correctos ***'
            });
        }
        // si llega a este punto quiere decir que el usuario si existe en la base de datos
        // por lo que necesitamos comprar la contraseña con la de la base de datos
    });
});
//req : lo que se esta solicitando, resp es la respuessta
userRoutes.post('/create', (req, res) => {
    // esta informacion tienen que venir desde la respuesta
    // en la req viene la ifnormacion que se esta posteando gracias al body parser
    //CREAR UN USUARIO
    const user = {
        nombre: req.body.nombre,
        email: req.body.email,
        password: bcrypt_1.default.hashSync(req.body.password, 10),
        avatar: req.body.avatar
    };
    // para guardar la informacion usamos la interface usuario . create y mandamos el user
    // de arriba
    usuario_model_1.Usuario.create(user).then(userDB => {
        const tokenUser = token_1.default.getJwtToken({
            _id: userDB._id,
            nombre: userDB.nombre,
            email: userDB.email,
            avatar: userDB.avatar //avatar del usuario
        });
        res.json({
            ok: true,
            token: tokenUser //aqui pongo el token generado arriba con todo lo que trae
        });
    }).catch(err => {
        res.json({
            ok: false,
            err
        });
    });
    // pasamos el user a la creacion
});
//ACTUALIZAR USUARIO
userRoutes.post('/update', autenticacion_1.verificaToken, (req, res) => {
    // si el token es correcto se ejecuta todo lo que esta aca , por que en el token
    // viene el id del usuario
    //esto solo aparece si el req paso por el middleware exitosamente
    const user = {
        nombre: req.body.nombre || req.usuario.nombre,
        email: req.body.email || req.usuario.email,
        avatar: req.body.avatar || req.usuario.avatar
    };
    usuario_model_1.Usuario.findByIdAndUpdate(req.usuario._id, user, { new: true }, (err, userDB) => {
        if (err)
            throw err;
        if (!userDB) {
            return res.json({
                ok: false,
                usuario: 'No existe un usuario con ese id'
            });
        }
        const tokenUser = token_1.default.getJwtToken({
            _id: userDB._id,
            nombre: userDB.nombre,
            email: userDB.email,
            avatar: userDB.avatar //avatar del usuario
        });
        res.json({
            ok: true,
            token: tokenUser //aqui pongo el token generado arriba con todo lo que trae
        });
    });
});
userRoutes.get('/', [autenticacion_1.verificaToken], (req, res) => {
    const usuario = req.usuario;
    res.json({
        ok: true,
        usuario
    });
});
exports.default = userRoutes;
