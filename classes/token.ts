import jwt from 'jsonwebtoken';

export default class Token {

    private static seed: string = 'strixseed'; //semilla
    private static caducidad: string = '30d';

    constructor(){}

    // metodo para obtener token
    // payload es lo que queremos que este dentro del token, id, nombre o lo qu sea
    static getJwtToken (payload: any) : string {

  return jwt.sign({//todo eso estara dentro del token
        usuario: payload
        }, this.seed,{ expiresIn: this.caducidad})
    }
    //el token vendra con el payload, basado en la semilla declarada arriba
    // y la fecha de expiracion declarada arriba


    static comprobarToken(userToken: string ){

        //generalmente funcionan con callback, pero en este caso se usaran promesas
      
        return new Promise((resolve, reject) =>{
            
            jwt.verify(userToken, this.seed, (err, decoded)=>{

                if (err){
                    //no confiar
                    reject();
                }else{
                    //token valido
                    resolve(decoded) //decoded tendra toda la informacion del payload
                }
                        
            })

        });

        
    }
}

//despues de esto vamos al login a utilizar el token y sus metodos