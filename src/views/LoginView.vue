<script setup>
    import { useForm, useField } from "vee-validate" // libreria vee-validate (v264)
    import {loginSchema as validationSchema} from "../validation/loginSchema" // v265

    const { handleSubmit } = useForm({validationSchema}) // libreria vee-validate (v264)
    const email = useField("email") // libreria vee-validate (v264)
    const password = useField("password") // libreria vee-validate (v264)

    const submit = handleSubmit(() => {
        console.log("submit");
    })
</script>

<template>
    <v-card
        flat
        max-width="600"
        class="mx-auto my-10"  
    >
        <v-card-title
        class="text-h4 font-weight-bold"
        tag="h3"
        >Iniciar Sesión</v-card-title>
        <v-card-subtitle class="text-h5">
            Inicia Sesión con tu cuenta
        </v-card-subtitle>
        <v-form 
            class="mt-5" 
        >
            <v-text-field 
                type="email"
                label="Email"
                bg-color="blue-grey-lighten-5"
                class="mb-3"
                v-model="email.value.value"
                :error-messages="email.errorMessage.value"
            />
            <v-text-field 
                type="password"
                label="Password"
                bg-color="blue-grey-lighten-5"
                class="mb-3"
                v-model="password.value.value"
                :error-messages="password.errorMessage.value"
            />
            <v-btn
                block
                color="pink-accent-3"
                @click="submit"
            >
                Iniciar Sesión
            </v-btn>
        </v-form>
    </v-card>
</template>
