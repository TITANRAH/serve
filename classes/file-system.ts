import { FileUpload } from '../interfaces/file-upload';
import path from 'path';
import fs from 'fs'; //para verificar si un directorio existe
import uniqid from 'uniqid'; //sirve para crear ids unico, instalado para crear nombre unico de file


//definomos una clase para crear las carpetas necesarias por usuario
//y la mando a llamar en la ruta post upload
export class FileSystem {

    constructor(){}

    //necesito userId por que ncesito crear la carpeta por usuario 

    guardarImagenTemporal(file: FileUpload, userId: string){

         //las promesas siempre tienen un resolve y un reject en este caso se usa void 
         //o el resolve dara problemas
        return new Promise<void>((resolve, reject)=>
        {
            //crear carpeta
            const path = this.crearCarpetaUsuario(userId);
    
            //aqui ocupo la funcion realizada y paso como argumento el file.name
            const nombreArchivo = this.generarNombreUnico(file.name);
    
            //mover el archivo del temp a nuestra carpeta Temp que esta en dist
            file.mv(`${path}/${nombreArchivo}`, (err: any )=> {
                if ( err ){
                    reject(err)//por si quisiera manejarlo en otra clase
                }else{
                    resolve();
                }
            });
        });
       

     

    }

    //me creo un metodo para darle al nombre del archivo

    generarNombreUnico(nombreOriginal:string){ 

        //primero debo saber que extension es

        //ejemplo de nombre original granrah.copy.jpg
        const nombreArr = nombreOriginal.split('.');//separo el arreglo por puntos (.)

        //al quedarme un arreglo de 3 elementos seria [granrah, copy, jpg]
        // nombreArr.length como es 0 1 2 y el nombre length represnta 3 , 3 - 1 cae en el 2
        const extension = nombreArr[nombreArr.length - 1];

        const idUnico = uniqid(); //le damos un nombre unico al archivo o file


        //por lo que el nombre del archivo sera el id unico seguido de la exrension del archivo
        return `${idUnico}.${extension}` 


        // * esta funcion la ocupo en guardar imagen temporal


    }


    //creacion de la carpeta por usuario
    private crearCarpetaUsuario( userId:string){

        const pathUser = path.resolve( __dirname,'../uploads/', userId) //esto crea el path que necesitamos
        const pathUserTemp = path.resolve( pathUser + '/temp'); 
        console.log('este es el path ',pathUserTemp)

        

        const existe = fs.existsSync(pathUser);

        if(!existe){ //si no existe crear
            fs.mkdirSync(pathUser, {recursive: true});
            fs.mkdirSync(pathUserTemp,{recursive: true});
        }

        return pathUserTemp;
    }

    imagenesDeTempHciaPost(userId: string){

        
        const pathTemp = path.resolve( __dirname, '../uploads/', userId, 'temp');
        const pathPost = path.resolve( __dirname, '../uploads/', userId, 'posts');

        if(!fs.existsSync(pathTemp)){
            return [];
        }

        if(!fs.existsSync(pathPost)){
            fs.mkdirSync(pathPost);
        }

        const imagenesTemp = this.obtenerImagenesEnTemp(userId);

        imagenesTemp.forEach(imagen=>{
            fs.renameSync( `${pathTemp}/${imagen}`, `${pathPost}/${imagen}`);

        });

        return imagenesTemp;
    }

    private obtenerImagenesEnTemp(userId: string){

        const pathTemp = path.resolve( __dirname, '../uploads/', userId, 'temp');
        console.log('este es el otro path',pathTemp)
        return fs.readdirSync(pathTemp) || [];

    }

    // getFotoUrl( userId: string, img: string ){

    //     //path Posts
    //     const pathFoto = path.resolve( __dirname, '../uploads', userId, 'posts', img)

    //     console.log('este es el path foto',pathFoto);


    //     const existe = fs.existsSync( pathFoto );

    //     if (!existe){
    //         return path.resolve( __dirname, '../assets/400x250.jpg' )
    //     }

    //     return pathFoto;
    // }

    
    getFotoUrl( userId: string, img: string ) {

        // Path POSTs
        const pathFoto = path.resolve( __dirname, '../uploads', userId, 'posts', img );


        // Si la imagen existe
        const existe = fs.existsSync( pathFoto );
        if ( !existe ) {
            return path.resolve( __dirname, '../assets/400x250.jpg' );
        }


        return pathFoto;

    }

}
