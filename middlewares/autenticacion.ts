import {Request, Response, NextFunction} from 'express';
import Token from '../classes/token';

export const verificaToken = (req: any, resp: Response, next: NextFunction) => {

     const userToken = req.get('x-token') || ''; //recibo el x-token si es null seria vacio

     Token.comprobarToken(userToken).then((decoded:any) =>{ 

        console.log( 'Decoded', decoded)
        req.usuario = decoded.usuario;
        next(); //puede continuar con el siguiente paso
     }).catch(err=>{
         resp.json({
             ok: false,
             mensaje: 'Token no es correcto'
         });
     });

}