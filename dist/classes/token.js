"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class Token {
    constructor() { }
    // metodo para obtener token
    // payload es lo que queremos que este dentro del token, id, nombre o lo qu sea
    static getJwtToken(payload) {
        return jsonwebtoken_1.default.sign({
            usuario: payload
        }, this.seed, { expiresIn: this.caducidad });
    }
    //el token vendra con el payload, basado en la semilla declarada arriba
    // y la fecha de expiracion declarada arriba
    static comprobarToken(userToken) {
        //generalmente funcionan con callback, pero en este caso se usaran promesas
        return new Promise((resolve, reject) => {
            jsonwebtoken_1.default.verify(userToken, this.seed, (err, decoded) => {
                if (err) {
                    //no confiar
                    reject();
                }
                else {
                    //token valido
                    resolve(decoded); //decoded tendra toda la informacion del payload
                }
            });
        });
    }
}
exports.default = Token;
Token.seed = 'strixseed'; //semilla
Token.caducidad = '30d';
//despues de esto vamos al login a utilizar el token y sus metodos
