"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const autenticacion_1 = require("../middlewares/autenticacion");
const post_model_1 = require("../models/post.model");
const file_system_1 = require("../classes/file-system");
const postRoutes = (0, express_1.Router)();
const fileSystem = new file_system_1.FileSystem(); //sistema de creacion de carpetas por usuario
// CREAR POST PAGINADOS
postRoutes.get('/', [autenticacion_1.verificaToken], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //de esta manera leo el url que se manda como parametro como por ejemplo pagina2
    //esto es igual a un string pero debo pasaralo a number
    // si no se encuentra la pagina regresa la pagina 1
    let pagina = Number(req.query.pagina) || 1;
    let skip = pagina - 1;
    skip = skip * 10;
    // con esto busco y muestro los 20 registro que cree en un usuario
    const posts = yield post_model_1.Post.find()
        .sort({ _id: -1 }) //orden de posts decendentes
        .skip(skip) //paginacion
        .limit(10) //maximo 10 registros mostrar
        .populate('usuario', '-password') //poblar el campo usuario con los datos de usuario menos password
        .exec(); //ejecutar
    // logica de paginacion : 
    // si pongo pagina 1, pagina 1 - 1 = 0 , 0 * 10 = 0, skip (0) = no se salta ningun registro 
    // si pongo pagna 2, pagina 2 -1 = 1, 1 * 10 = 10, skip(10) = saltate los ultimos 10 registros
    // si pongo pagina 3, pagina 3 - 1 = 2, 2 * 10 = 20, skip(20) = saltate los ultimos 20 registros 
    res.json({
        ok: true,
        pagina,
        posts
    });
}));
//ruta del posteo, necesito el middleware para poder verificar
// el usuario que realiza ese token
//una vez realizada la ruta debo ir a mi index a declararla
// en las rutas de mi app
// CREAR POST 
postRoutes.post('/', [autenticacion_1.verificaToken], (req, res) => {
    // la informacion viene en el body de la respuesta
    // recibire la misma info que tiuene mi modelo
    // eso escribimos en postman, en el header va el token, en el body la info de mi modelo post.mnodel.ts
    // no hay que poner usuario en postman por q ue eso lo definira el token
    const body = req.body;
    body.usuario = req.usuario._id; //con esto confirmo que la informacion viene en el body
    // y me devuelve el usuario al poner body en el res.json
    //con esto ya creo el registro de la informacion en base de datos
    const imagenes = fileSystem.imagenesDeTempHciaPost(req.usuario._id);
    console.log(imagenes);
    body.img = imagenes;
    post_model_1.Post.create(body).then((postDB) => __awaiter(void 0, void 0, void 0, function* () {
        yield postDB.populate('usuario', '-password');
        //mongoose removio execPopulate por lo que no es necesario
        // con esto populate('') significa 'poblar' insertamos todo el objeto del usuario que esstamos trabajando oosea logeado en postman
        // y no solo su id como venia trayendo hasta este codigo
        //al usar -password no se muestra la contraseña en el json
        res.json({
            ok: true,
            post: postDB //con esto compruebo que guardo en el post 
        });
    })).catch(err => {
        res.json(err);
    });
});
// Servicio para subir archivos
// con este codigo yo puedo ver en postman las propiedades para luego crearme una interface llamada fileUpload
postRoutes.post('/upload', [autenticacion_1.verificaToken], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.files) { //si no hay ningun archivo
        return res.status(400).json({
            ok: false,
            mensaje: 'No se subio ningun archivo'
        });
    }
    const file = req.files.image;
    if (!file) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No se subio ningun archivo - image'
        });
    }
    if (!file.mimetype.includes('imagen')) { // si lo que sube no es una imagen
        return res.status(400).json({
            ok: false,
            mensaje: 'Lo que subio no es una imagen'
        });
    }
    yield fileSystem.guardarImagenTemporal(file, req.usuario._id);
    res.json({
        ok: true,
        file: file.mimetype //a raiz de hacer por interfaz pdemos tener el mimetype     
    });
}));
postRoutes.get('/imagen/:userid/:img', (req, res) => {
    const userId = req.params.userid;
    const img = req.params.img;
    const pathFoto = fileSystem.getFotoUrl(userId, img);
    res.sendFile(pathFoto);
});
exports.default = postRoutes;
