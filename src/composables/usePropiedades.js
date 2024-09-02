import { computed, ref } from "vue"
import { collection, doc, deleteDoc } from "firebase/firestore"; // v291|v306
// import { ref as storageRef, deleteObject } from "firebase/storage"; // v307

// useFirestore es un composable de vuefire par interacruar con Firestore (la DB de Firebase) (291)
// useCollection es otro composable de vuefire que usamos cuando queremos acceder a mas de un documento de una coleccion (291)
// el composable useFirebaseStorage sirve para que Firebese identifique que servicio vamos a utilizar y que conozca nuestras credenciales
import { useFirestore, useCollection, useFirebaseStorage } from "vuefire";

import useImage from "@/composables/useImage"; // implementacion LIO

export default function usePropiedades() {

    // conexion al servicio de Storage de Firebase (v306)
    const storage = useFirebaseStorage()

    const db = useFirestore() // v291
    
    // propiedadesCollection almacena la respuesta de una especie de una consulta "SELECT * FROM propiedades" a Firestore (la DB de Firebase) (v291)
    const propiedadesCollection = useCollection(collection(db, "propiedades")) 

    const alberca = ref(false)

    const { deleteImage } = useImage() // implementacion LIO

    // funcion asincrona(?) para eliminar un registro de la DB de Firestore (v306) y la imagen asociada a este registro (v307)
    async function deleteItem(id, urlImage) {
        if(confirm("Deseas eliminar esta propiedad?")) {
            const docRef = doc(db, "propiedades", id) // referencia al documento a eliminar en la DB (v306)

            // con await Promise.all(...) podemos ejecutar varios await en simultaneo (v307)
            // si no lo hiciesemos de esta forma, y ejecutasemos primero await deleteDoc(...) y en la linea de abajo await deleteObject(...), cuando se resuelva el primer await recien comenzaria a ejecutarse el segundo (v307)
            // en algunos casos querremos que esto sea asi; en este caso queremos que ambas acciones se hagan en simultaneo, por eso implementamos await Promise.all(...) (v307)
            await Promise.all([
                deleteDoc(docRef), // esta linea hace la peticion DELETE a la API de Firebase para eliminar una propiedad (v306)
                deleteImage(urlImage),  // implementacion LIO
            ])
        }
    }

    const filteredItems = computed( () => {
        return alberca.value ?
            propiedadesCollection.value.filter( propiedad => propiedad.alberca) :
            propiedadesCollection.value
    })

    return {
        alberca,
        propiedadesCollection,
        filteredItems,
        deleteItem,
    }
}