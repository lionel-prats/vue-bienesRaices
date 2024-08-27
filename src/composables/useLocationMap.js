import { ref } from "vue"

export default function useLocationMap() { // v289

    const zoom = ref(15)
    const center = ref([-34.6411981,-58.4803988]) // coordenadas de Directorio y Lacarra (las puedo obtener de la URL de Google maps (v289) )

    function pin(e) {
        const { lat, lng } = e.target.getLatLng()
        center.value = [lat, lng]
    }

    return {
        zoom,
        center,
        pin,
    }
}