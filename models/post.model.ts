import {Schema, model, Document} from 'mongoose';

const postSchema = new Schema ({

    created: {
        type: Date
    },
    mensaje: {
        type: String
    },
    img: [{
        type: String
    }],
    coords: {
        type: String //latitud, longitud
    },
    usuario: { 
        type: Schema.Types.ObjectId, //esto se usa para referenciar al usuario en base de datos
        ref: 'Usuario',
        required: [ true, 'Debe existir una referencia a un usuario']
    }

});

postSchema.pre<IPost>('save', function(next){ //le agregamos el IPost para decir que es de 
    // tipo de la interface creada

    this.created = new Date();
    next();

});

// creamos la interface para postSchema

interface IPost extends Document {

    created: Date;
    mensaje: string;
    img: string[];
    coords: string;
    usuario: string;

}

//exportamos

export const Post = model<IPost>('Post', postSchema);