import { computed } from "vue"

import { ref as storageRef } from "firebase/storage" // v285

// el composable useFirebaseStorage sirve para que Firebese identifique que servicio vamos a utilizar y que conozca nuestras credenciales (v285)
// el composable useStorageFile va a tener una serie de funciones que son muy utiles para trabajar con los archivos del storage de Firebase (funciones para subir esos archivos hacia el servidor)
import { useFirebaseStorage, useStorageFile } from "vuefire"
import {uid} from "uid" // dependencia para crear ids unicos (v285)

export default function useImage() { // v285

    // conexion al servicio de Storage de Firebase (v285)
    const storage = useFirebaseStorage()
    
    // esta variable va a contener el path en el storage de Firebase donde vamos a guardar fisicamente las imagenes que el usuario cargue en el form de crear propiedad
    const storageRefPath = storageRef(storage, `/propiedades/${uid()}.jpg`)

    const {
        url, // funcion para obtener la url de la imagen subida a Firebase, para accederla desde el navegador
        upload, // funcion para subir una imagen al storage de Firebase
    } = useStorageFile(storageRefPath)

    function uploadImage(e) {
        const data = e.target.files[0]
        if(data) {
            // con la funcion upload() de vuefire almaceno la imagen fisica en el storage de Firebase apenas el usuario la carga en el input del form (v286)
            upload(data) 
        }
    }

    // implementacion LIO parte#2 para eliminar uina imagen del Storage de Firebase (luego de ver la explicacion del v307)
    // async function deleteImage(urlImage) {
    //     const imageRef = storageRef(storage, urlImage);
    //     await deleteObject(imageRef);
    // }
    // fin implementacion LIO parte #2


    const image = computed( () => {
        return url.value ? url.value : null
    })

    return {
        url,
        uploadImage,
        image,
        // deleteImage, // implementacion LIO parte#3
    }
}