"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verificaToken = void 0;
const token_1 = __importDefault(require("../classes/token"));
const verificaToken = (req, resp, next) => {
    const userToken = req.get('x-token') || ''; //recibo el x-token si es null seria vacio
    token_1.default.comprobarToken(userToken).then((decoded) => {
        console.log('Decoded', decoded);
        req.usuario = decoded.usuario;
        next(); //puede continuar con el siguiente paso
    }).catch(err => {
        resp.json({
            ok: false,
            mensaje: 'Token no es correcto'
        });
    });
};
exports.verificaToken = verificaToken;
