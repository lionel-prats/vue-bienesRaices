import { computed } from "vue"

import { collection } from "firebase/firestore"; // v291

// useFirestore es un composable de vuefire par interacruar con Firestore (la DB de Firebase) (291)
// useCollection es otro composable de vuefire (291)
import { useFirestore, useCollection } from "vuefire";

export default function usePropiedades() {

    const db = useFirestore() // v291
    
    // propiedadesCollection almacena la respuesta de una especie de una consulta "SELECT * FROM propiedades" a Firestore (la DB de Firebase) (v291)
    const propiedadesCollection = useCollection(collection(db, "propiedades")) 

    // computed property para formatear los precios de las propiedades invocandolo desde src\views\admin\AdminView.vue (http://localhost:5173/admin/propiedades) (v293)
    const propertyPrice = computed( () => { 
        return (price) => 
            Number(price).toLocaleString("es-AR" , { style: "currency", currency: "ARS" }) 
    })

    return {
        propiedadesCollection,
        propertyPrice,
    }
}