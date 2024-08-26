<script setup>
    import { useForm, useField } from "vee-validate" 

    // funciones de Firebase para grabar en la DB (v283)
    // doc -> https://firebase.google.com/docs/firestore/manage-data/add-data?hl=es-419#add_a_document
    import { collection, addDoc } from "firebase/firestore"; 

    // importo useFirestore para cada vez que vayamos a interactuar con la DB de Firebase (v283)
    import { useFirestore } from "vuefire" 

    import { useRouter } from "vue-router"

    import { validationSchema, imageSchema } from "@/validation/propiedadSchema" 

    const items = [1, 2, 3, 4, 5]

    const router = useRouter()

    const db = useFirestore() // v284

    const { handleSubmit } = useForm({
        validationSchema: {
            ...validationSchema,
            ...imageSchema,
        }
    })
    const titulo = useField("titulo") 
    const imagen = useField("imagen") 
    const precio = useField("precio") 
    const habitaciones = useField("habitaciones") 
    const wc = useField("wc") 
    const estacionamiento = useField("estacionamiento") 
    const descripcion = useField("descripcion") 

    // al model alberca le agregamos estos 2 otros parametros para que no rompa cuando hagamos el INSERT en Firebase si la propiedad creada no tiene alberca (v284)
    const alberca = useField("alberca", null, { initialValue: false }) 

    // peticion a la API de Firebase para grabar en la tabla propiedades un nuevo registro (v284)
    const submit = handleSubmit( async(values) => { 
        const { imagen, ...propiedad } = values
        const docRef = await addDoc(collection(db, "propiedades"), {
            ...propiedad
        });
        if(docRef.id) {
            router.push({name: 'admin-propiedades'})
        }
    })
</script>

<template>
    <v-card
        max-width="800"
        flat
        class="mx-auto my-10"
    >
        <v-card-title
            class="text-h4 font-weight-bold"
            tag="h3"
        >Nueva Propiedad</v-card-title>
        <v-card-subtitle class="text-h5">
            Crea una nueva propiedad llenando el siguiente formulario
        </v-card-subtitle>
        <v-form class="mt-10">
            <v-text-field 
                class="mb-5"
                label="Título propiedad"
                v-model="titulo.value.value"
                :error-messages="titulo.errorMessage.value"
            />
            <v-file-input 
                class="mb-5"
                accept="image/jpeg"
                label="Fotografía"
                prepend-icon="mdi-camera"
                v-model="imagen.value.value"
                :error-messages="imagen.errorMessage.value"
            />
            <v-text-field 
                class="mb-5"
                label="Precio"
                v-model="precio.value.value"
                :error-messages="precio.errorMessage.value"
            />
            <v-row>
                <v-col
                    cols="12"
                    md="4"
                >
                    <v-select
                        class="mb-5"
                        label="Habitaciones"
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
                        class="mb-5"
                        label="WC"
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
                        class="mb-5"
                        label="Lugares Estacionamiento"
                        :items="items"
                        v-model="estacionamiento.value.value"
                        :error-messages="estacionamiento.errorMessage.value"
                    />
                </v-col>
            </v-row>
            <v-textarea 
                class="mb-5"
                label="Descripción"
                v-model="descripcion.value.value"
                :error-messages="descripcion.errorMessage.value"
            />
            <v-checkbox
                label="Alberca" 
                v-model="alberca.value.value"
            />
            <v-btn
                color="pink-accent-3"
                block
                @click="submit"
            >Agregar Propiedad</v-btn>
        </v-form>
    </v-card>
</template>