import Server from "./classes/server";
import mongoose from "mongoose";

import bodyParser from "body-parser";
import fileUpload from 'express-fileupload'

import postRoutes from './routes/post';
import userRoutes from './routes/usuario';


const server = new Server();

// body parser, es un middlwer, que siempre se ejecuta
// prepara el objeto de cualquier peticion para usarlo 

server.app.use( bodyParser.urlencoded({extended: true}));
server.app.use( bodyParser.json()); //pasa a formato json 

//FileUpload otro middleware para subir archivos
server.app.use( fileUpload({useTempFiles: false}) )

//rutas de mi app
server.app.use('/user', userRoutes)
server.app.use('/posts', postRoutes)

// conectar base de dato
mongoose.connect('mongodb://localhost:27017/fotosgram', {

}, (error) => {
    if (error) {
        throw error;
    }
    console.log('Base de datos online');
});

//levantar express
server.start(()=>{
    console.log(`servidor corriendo en puerto${server.port}`)
})



