import {Schema, model} from 'mongoose'; //define un esquema o un modelo
import bcrypt from 'bcrypt';

const usuarioSchema: Schema<Iusuario> = new Schema({

    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']    
    },
    avatar: {
        type: String,
        default: 'av-1.png'
    },
    email: {
        type: String,
        unique: true,
        required: [true,'el correo es necesario']
    },
    password: {
        type: String,
        required: [true, 'la contraseña es necesaria']
    }

});

//metodo de comparar password

usuarioSchema.method('compararPassword', function(password: string = ''): boolean{

    if (bcrypt.compareSync(password, this.password)){ // si esto se compara y son correctos

        return true;
    }else{
        return false;
    }
})

interface Iusuario extends Document{
    nombre: string,
    email: string,
    password: string,
    avatar: string,

    compararPassword(password: string): boolean;
}

export const Usuario = model<Iusuario>('Usuario', usuarioSchema)