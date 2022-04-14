"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileSystem = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs")); //para verificar si un directorio existe
const uniqid_1 = __importDefault(require("uniqid")); //sirve para crear ids unico, instalado para crear nombre unico de file
//definomos una clase para crear las carpetas necesarias por usuario
//y la mando a llamar en la ruta post upload
class FileSystem {
    constructor() { }
    //necesito userId por que ncesito crear la carpeta por usuario 
    guardarImagenTemporal(file, userId) {
        //las promesas siempre tienen un resolve y un reject en este caso se usa void 
        //o el resolve dara problemas
        return new Promise((resolve, reject) => {
            //crear carpeta
            const path = this.crearCarpetaUsuario(userId);
            //aqui ocupo la funcion realizada y paso como argumento el file.name
            const nombreArchivo = this.generarNombreUnico(file.name);
            //mover el archivo del temp a nuestra carpeta Temp que esta en dist
            file.mv(`${path}/${nombreArchivo}`, (err) => {
                if (err) {
                    reject(err); //por si quisiera manejarlo en otra clase
                }
                else {
                    resolve();
                }
            });
        });
    }
    //me creo un metodo para darle al nombre del archivo
    generarNombreUnico(nombreOriginal) {
        //primero debo saber que extension es
        //ejemplo de nombre original granrah.copy.jpg
        const nombreArr = nombreOriginal.split('.'); //separo el arreglo por puntos (.)
        //al quedarme un arreglo de 3 elementos seria [granrah, copy, jpg]
        // nombreArr.length como es 0 1 2 y el nombre length represnta 3 , 3 - 1 cae en el 2
        const extension = nombreArr[nombreArr.length - 1];
        const idUnico = (0, uniqid_1.default)(); //le damos un nombre unico al archivo o file
        //por lo que el nombre del archivo sera el id unico seguido de la exrension del archivo
        return `${idUnico}.${extension}`;
        // * esta funcion la ocupo en guardar imagen temporal
    }
    //creacion de la carpeta por usuario
    crearCarpetaUsuario(userId) {
        const pathUser = path_1.default.resolve(__dirname, '../uploads/', userId); //esto crea el path que necesitamos
        const pathUserTemp = path_1.default.resolve(pathUser + '/temp');
        console.log('este es el path ', pathUserTemp);
        const existe = fs_1.default.existsSync(pathUser);
        if (!existe) { //si no existe crear
            fs_1.default.mkdirSync(pathUser, { recursive: true });
            fs_1.default.mkdirSync(pathUserTemp, { recursive: true });
        }
        return pathUserTemp;
    }
    imagenesDeTempHciaPost(userId) {
        const pathTemp = path_1.default.resolve(__dirname, '../uploads/', userId, 'temp');
        const pathPost = path_1.default.resolve(__dirname, '../uploads/', userId, 'posts');
        if (!fs_1.default.existsSync(pathTemp)) {
            return [];
        }
        if (!fs_1.default.existsSync(pathPost)) {
            fs_1.default.mkdirSync(pathPost);
        }
        const imagenesTemp = this.obtenerImagenesEnTemp(userId);
        imagenesTemp.forEach(imagen => {
            fs_1.default.renameSync(`${pathTemp}/${imagen}`, `${pathPost}/${imagen}`);
        });
        return imagenesTemp;
    }
    obtenerImagenesEnTemp(userId) {
        const pathTemp = path_1.default.resolve(__dirname, '../uploads/', userId, 'temp');
        console.log('este es el otro path', pathTemp);
        return fs_1.default.readdirSync(pathTemp) || [];
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
    getFotoUrl(userId, img) {
        // Path POSTs
        const pathFoto = path_1.default.resolve(__dirname, '../uploads', userId, 'posts', img);
        // Si la imagen existe
        const existe = fs_1.default.existsSync(pathFoto);
        if (!existe) {
            return path_1.default.resolve(__dirname, '../assets/400x250.jpg');
        }
        return pathFoto;
    }
}
exports.FileSystem = FileSystem;
