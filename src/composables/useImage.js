import { computed } from "vue"

import { ref as storageRef } from "firebase/storage" // v285

// el composable useFirebaseStorage sirve para que Firebese identifique que servicio vamos a utilizar y que conozva nuestras credenciales (v285)
// el composable useStorageFile va a tener una serie de funciones que son muy utiles para trabajar con los archivos del storage de Firebase (funciones para subir esos archivos hacia el servidor)
import { useFirebaseStorage, useStorageFile } from "vuefire"
import {uid} from "uid" // dependencia para crear ids unicos (v285)

export default function useImage() { // v285

    // conexion al servicio de Storage de Firebase (v285)
    const storage = useFirebaseStorage()
    
    // esta variable va a contener la ubicacion de la imagen que vamos a subir
    const storageRefPath = storageRef(storage, `/propiedades/${uid()}.jpg`)

    const {
        url,
        upload, // funcion para subir una imagen al storage de Firebase
    } = useStorageFile(storageRefPath)

    function uploadImage(e) {
        const data = e.target.files[0]
        if(data) {
            // almaceno la imagen fisica en el storage de Firebase apenas el usuario la carga en el input del form (v286)
            upload(data) 
        }
        console.log(url);
    }

    const image = computed( () => {
        return url.value ? url.value : null
    })

    return {
        url,
        uploadImage,
        image,
    }
}