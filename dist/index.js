"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("./classes/server"));
const mongoose_1 = __importDefault(require("mongoose"));
const body_parser_1 = __importDefault(require("body-parser"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const post_1 = __importDefault(require("./routes/post"));
const usuario_1 = __importDefault(require("./routes/usuario"));
const server = new server_1.default();
// body parser, es un middlwer, que siempre se ejecuta
// prepara el objeto de cualquier peticion para usarlo 
server.app.use(body_parser_1.default.urlencoded({ extended: true }));
server.app.use(body_parser_1.default.json()); //pasa a formato json 
//FileUpload otro middleware para subir archivos
server.app.use((0, express_fileupload_1.default)({ useTempFiles: false }));
//para error en la app
server.app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});
//rutas de mi app
server.app.use('/user', usuario_1.default);
server.app.use('/posts', post_1.default);
// conectar base de dato
mongoose_1.default.connect('mongodb://localhost:27017/fotosgram', {}, (error) => {
    if (error) {
        throw error;
    }
    console.log('Base de datos online');
});
//levantar express
server.start(() => {
    console.log(`servidor corriendo en puerto${server.port}`);
});
