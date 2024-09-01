<script setup>
    import { watch } from "vue"
    import { useRoute } from "vue-router" // v302
    import { doc } from "firebase/firestore" // v303
    import { useFirestore, useDocument } from "vuefire" // v303
    import { propertyPrice } from "@/helpers" // v303

    // imports Leaflet (mapa para mostrar ubicaciones tipo Google Maps) 
    import "leaflet/dist/leaflet.css";
    import { LMap, LTileLayer, LMarker, LPopup } from "@vue-leaflet/vue-leaflet";
    import useLocationMap from "@/composables/useLocationMap"
    // fin imports Leaflet

    const { zoom, center, pin } = useLocationMap() // Leaflet

    // bloque para obtener la propiedad (v303)
    const route = useRoute()
    const db = useFirestore() // instancia de la DB de Firebase
    const docRef = doc(db, "propiedades", route.params.id) // referencia al registro en la DB
    const propiedad = useDocument(docRef) // obtengo el registro de la DB
    // fin bloque

    // cuando apenas se cargue propiedad con la respuesta de la API, cargamos las coordenadas de la propiedad en center.value para mostrar correctamente el mapa (v304)
    watch( propiedad, (propiedad) => {
        console.log("llegó la respuesta de la API de Firebase!!");
        center.value = propiedad.ubicacion
    })

</script>
<template>
    <v-card flat>
        <v-card-title class="mt-5 text-h3 text-center font-weight-bold">
            {{ propiedad?.titulo }}
        </v-card-title>
        <v-img :src="propiedad?.imagen" height="550" cover />
        <div class="bg-blue-grey-lighten-5 d-flex flex-column flex-md-row align-center">
            <v-card-text>
                Precio: 
                <span class="font-weight-bold">{{ propertyPrice(propiedad?.precio) }}</span>
            </v-card-text>
            <v-card-text>
                Baños: 
                <span class="font-weight-bold">{{ propiedad?.wc }}</span>
            </v-card-text>
            <v-card-text>
                Estacionamiento: 
                <span class="font-weight-bold">{{ propiedad?.estacionamiento }}</span>
            </v-card-text>
            <v-card-text>
                Habitaciones: 
                <span class="font-weight-bold">{{ propiedad?.habitaciones }}</span>
            </v-card-text>
        </div>
        <v-row>
            <v-col
                cols="12"
                md="8"
            >
                <div class="text-pre-wrap py-10">
                    {{ propiedad?.descripcion }}
                </div>
            </v-col>
            <v-col
                cols="12"
                md="4"
            >
                <!-- mapa Leaflet (v304) -->
                <div class="py-10" style="height: 600px;">
                    <LMap
                        v-model:zoom="zoom" 
                        :center="center"
                        :use-global-leaflet="false"
                    >
                        <LMarker 
                            :lat-lng="center"
                        >
                        <LPopup>
                            <p><span class="d-block mb-1 font-weight-black">Vendedor:</span>Valeria Pirucha</p>
                            <p><span class="d-block mb-1 font-weight-black">Contacto:</span>11-1234-5678</p>
                        </LPopup> 
                        </LMarker>
                        <!-- eliminamos estos dos props para que el visitante no pueda mover el pin del mapa (v304) -->
                        <!-- draggable -->
                        <!-- @moveend="pin"  -->
                        <LTileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        ></LTileLayer>
                    </LMap>
                </div>
                <!-- fin mapa Leaflet (v304) -->
            </v-col>
        </v-row>
    </v-card>
</template>

