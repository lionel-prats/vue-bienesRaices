<script setup>

    import { watch } from "vue"

    import { useRoute, useRouter } from "vue-router"
    // useFirestore es un composable de vuefire par interacruar con Firestore (la DB de Firebase) (294)
    // el composable de vuefire useDocument lo usamos cuando queremos acceder a un solo documento (en este caso propiedad) de una coleccion, en la DB de Firebase (v294)
    import { useFirestore, useDocument } from "vuefire";
    // updateDoc lo usamos para actualizar un registro en firestore
    import { doc, updateDoc } from "firebase/firestore"; // v294

    // gist Valdez para configurar el form de edicion (codigo similar al form de creacion) (v295)
    import { useField, useForm } from "vee-validate"
    // leaflet
    import "leaflet/dist/leaflet.css";
    import { LMap, LTileLayer, LMarker } from "@vue-leaflet/vue-leaflet";
    import useImage from '@/composables/useImage'
    import useLocationMap from '@/composables/useLocationMap'
    import { validationSchema } from '@/validation/propiedadSchema'
    const items = [1,2,3,4,5]
    const { url, uploadImage, image } = useImage()
    const { zoom, center, pin } = useLocationMap()
    const { handleSubmit } = useForm({ validationSchema })
    const titulo = useField('titulo')
    const imagen = useField('imagen')
    const precio = useField('precio')
    const habitaciones = useField('habitaciones')
    const wc = useField('wc')
    const estacionamiento = useField('estacionamiento')
    const descripcion = useField('descripcion')
    const alberca = useField('alberca')
    // fin gist

    // bloque para obtener la propiedad a editar (peticion a la API de Firebase) (v294)
    const route = useRoute()
    const router = useRouter()
    const db = useFirestore() // conectamos la app Vue con Firebase
    const docRef = doc(db, "propiedades", route.params.id) // obtenemos la referencia al documento (propiedad a editar)
    const propiedad = useDocument(docRef) // obtenemos el documento asociado al id de la URL
    // fin bloque

    // bloque para cargar en los inputs del form de edicion los datos de la propiedad que se pretende editar, apenas obtenemos la respuesta de la API de Firebase, y almacenarla en propiedad (v296)
    watch(propiedad, (propiedad) => {
        titulo.value.value = propiedad.titulo
        precio.value.value = propiedad.precio
        habitaciones.value.value = propiedad.habitaciones
        wc.value.value = propiedad.wc
        estacionamiento.value.value = propiedad.estacionamiento
        descripcion.value.value = propiedad.descripcion
        alberca.value.value = propiedad.alberca
        center.value = propiedad.ubicacion
    })
    // fin bloque

    // peticion a la API de Firebase para UPDATEAR la propiedad en propiedades (v295)
    const submit = handleSubmit( async(values) => { 
        
        // values.imagen lo guardo en imagen; el resto del objeto lo guardo en propiedad (v298)
        // propiedad sera parte del objeto que voy a mandar en la peticion a Firebase para el UPDATE del registro (propiedad), y de arranque saco la key imagen, porque puede que el usuario no modifique la imagen original, y de esta manera me aseguro de que no se pise el campo imagen del registro existente 
        const { imagen, ...propiedad } = values

        // empiezo a construir el objeto para el UPDATE
        const data = {
            ...propiedad, // desparramos todas las claves del objeto del form de edicion al momento del submit en el nuevo objeto data (v298)
            ubicacion: center.value // en el nuevo objeto data, agrego la clave ubicacion y en el value le paso las coordenadas del mapa del form de edicion al momento del submit (pueden ser las coordenadas previas o unas nuevas si el usuario movió la gotita) (v298)
        }

        // image es un computed property del composable useImage; si el usuario no carga una imagen nueva en el form de edicion, su valor sera null; si cargo imagen nueva, esta ya se almacenó en el storage de Firebase, y image contendrá la url para acceder a esta nueva imagen desde el navegador 
        // entonces, si el usuario actualizo la iamgen de la propiedad, agrego la key imagen al objeto data, para actualizar el campo imagen en el registro en la DB
        // a su vez, luego de ver el v307 donde Valdez explica como eliminar la imagen de una propiedad cuando esta se elimina de la DB, relizé una implementacion propia dentro de este if para eliminar la imagen anterior del storage cuando el usuario actualiza la imagen de una propiedadd en el form de edicion 
        if(image.value) {

            
            data.imagen = url.value
        }

        // hago la peticion para el UPDATE usando la funcion que nos proporciona Firebase para esta accion, pasandole la referencia al registro que queremos modificar y el objeto cuyas keys reescribiran las keys originales del registro en la DB
        await updateDoc(docRef, data)
        
        // redirijo al usuario luego del UPDATE
        router.push({name: 'admin-propiedades'})

    })

</script>

<template>
    <v-card max-width="800" flat class="mx-auto my-10">
        <v-card-title class="mt-5">
            <h1 class="text-h4 font-weight-bold">Editar Propiedad</h1>
        </v-card-title>
        <v-card-subtitle > 
            <p class="text-h5">Edita los detalles de la propiedad</p>
        </v-card-subtitle>

        <v-form class="mt-10">
            <v-text-field
                v-model="titulo.value.value"
                :error-messages="titulo.errorMessage.value"
                label="Titulo"
                class="mb-5"
            ></v-text-field>

            <v-file-input
                v-model="imagen.value.value"
                :error-messages="imagen.errorMessage.value"
                accept="image/jpeg"
                prepend-icon="mdi-camera"
                label="Fotografía"
                class="mb-5"
                @change="uploadImage"
            ></v-file-input>

            <!-- por default, genero un preview de la imagen actual de la propiedad a editar; si el usuario carga una nueva imagen actualizo el preview -->
            <div class="my-5">
                <p class="font-weight-bold">Imagen Actual:</p>

                <!-- preview actualizado si el usuario cargo una nueva imagen -->
                <img 
                    v-if="image"    
                    class="w-50" 
                    :src="image" 
                    alt="imagen propiedad"
                >

                <!-- preview por default con la imagen actual de la propiedad que se quiere editar -->
                <img 
                    v-else
                    class="w-50" 
                    :src="propiedad?.imagen ? propiedad.imagen : '/logo_codigo_con_juan.png'" 
                    alt="imagen propiedad"
                >
                <!-- propiedad?.imagen = "Optional Chaining" (v297) -->
                <!-- hasta que obtengo la respuesta de la API de Firebase para autocompletar el form (incluyendo la imagen actual para el preview), cargo momentaneamente una imagen dump -->
            </div>

            <v-text-field
                v-model="precio.value.value"
                :error-messages="precio.errorMessage.value"
                label="Precio"
                class="mb-5"
            ></v-text-field>

            <v-row>
                <v-col
                    cols="12"
                    md="4"
                >
                    <v-select 
                        label="Habitaciones"
                        class="mb-5"
                        :items="items"
                        v-model="habitaciones.value.value"
                        :error-messages="habitaciones.errorMessage.value"
                    />
                </v-col>

                <v-col
                    cols="12"
                    md="4"
                >
                    <v-select 
                        label="WC"
                        class="mb-5"
                        :items="items"
                        v-model="wc.value.value"
                        :error-messages="wc.errorMessage.value"
                    />
                </v-col>

                <v-col
                    cols="12"
                    md="4"
                >
                    <v-select 
                        label="Lugares Estacionamiento"
                        class="mb-5"
                        :items="items"
                        v-model="estacionamiento.value.value"
                        :error-messages="estacionamiento.errorMessage.value"
                    />
                </v-col>
            </v-row>

            <v-textarea
                v-model="descripcion.value.value"
                :error-messages="descripcion.errorMessage.value"
                label="Descripción"
                class="mb-5"
            ></v-textarea>

            <v-checkbox 
                v-model="alberca.value.value"
                label="Alberca"
            ></v-checkbox>

            <!-- mapa Leaflet (v296) -->
            <h2 class="font-weight-bold text-center my-5">Ubicación</h2>
            <div class="pb-10">
                <div style="height:600px">
                    <LMap 
                        v-model:zoom="zoom" 
                        :center="center" 
                        :use-global-leaflet="false" 
                    >
                    <LMarker
                        :lat-lng="center"
                        draggable
                        @moveend="pin"
                    />
                    <LTileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        ></LTileLayer>
                    </LMap>
                </div>
            </div>
            <!-- fin mapa Leaflet (v296) -->

            <v-btn
                color="pink-accent-3"
                block
                @click="submit"
            >Guardar Cambios</v-btn>
        </v-form>

    </v-card>
</template>