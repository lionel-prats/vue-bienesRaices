import { computed, ref } from "vue"
import { collection } from "firebase/firestore"; // v291

// useFirestore es un composable de vuefire par interacruar con Firestore (la DB de Firebase) (291)
// useCollection es otro composable de vuefire que usamos cuando queremos acceder a mas de un documento de una coleccion (291)
import { useFirestore, useCollection } from "vuefire";

export default function usePropiedades() {

    const db = useFirestore() // v291
    
    // propiedadesCollection almacena la respuesta de una especie de una consulta "SELECT * FROM propiedades" a Firestore (la DB de Firebase) (v291)
    const propiedadesCollection = useCollection(collection(db, "propiedades")) 

    const alberca = ref(false)

    const propiedadesFiltradas = computed( () => {
        return alberca.value ?
            propiedadesCollection.value.filter( propiedad => propiedad.alberca) :
            propiedadesCollection.value
    })

    return {
        alberca,
        propiedadesCollection,
        propiedadesFiltradas,
    }
}