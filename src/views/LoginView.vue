<script setup>
    
    // importo un par de composables de la libreria vee-validate (v264)
    // useForm va a tener el metodo para enviar el submit hacia el formulario y recuperar los datos de los campos (v264)
    // useField nos va a permitir atar cierto modelo a un input pero tambien tener validacion, y si no se cumple esa validacion, mostrar los mensajes de error (v264)
    import { useForm, useField } from "vee-validate" 
    
    // importo las reglas de validacion (schema de validacion) definidas manualmente para que vee-validate valide los campos de mi form (v265)
    import {loginSchema as validationSchema} from "../validation/loginSchema" 

    // importo el store que tendra toda la logica de autenticacion de usuarios (v268)
    import { useAuthStore } from "../stores/auth" 

    // obtengo el metodo handleSubmit() del composable useForm de la libreria vee-validate (v264)
    // al composable useForm() le paso las reglas de validacion definidas en v265 para que vee-validate realize la validacion
    // useForm() espera recibir un objeto del tipo {validationSchema: {...}}; al ponerle de alias "validationSchema" al objeto importado de src\validation\loginSchema.js JS nos permite simplificar la sintaxis (v265)
    const { handleSubmit } = useForm({validationSchema})
    
    // inicializo el store con la logica de autenticacion de usuarios (v268)
    const auth = useAuthStore()

    // generamos estas dos variables con el composable useField de la libreria vee-validate, que genera unos objetos con mucha info (podemos hacer un console.log para chequear) (v264)
    // con v-model asociamos los 2 campos del form a cada una de estas variables (ver inputs en el template de este mismo archivo) (v264)
    // lo que cargue el usuario se va a almacenar en automatico en email.value.value (lo mismo para password)
    // los posibles errores de validacion se van a almacenar en automatico en email.errorMessage.value (lo mismo para password)
    const email = useField("email") 
    const password = useField("password")

    // la funcion submit() se ejecuta con el click en "btn.INICIAR SESION" (v265)
    // esta funcion intenta ejecutar el metodo handleSubmit() del composable useForm de la libreria vee-validate
    // handleSubmit() solo se ejecutarar si se superan las validaciones de los campos
    // vee-validate realizara la validacion de los campos en automatico segun el schema de validacion que le pasamos al composable useForm en linea 16 (v265)
    // si hay algun error de validacion en alguno de los campos, handleSubmit() no se ejecutará, y podemos configurar cada input para que renderize el error con el prop :error-messages y pasandole como valor email.errorMessage.value (lo mismo para password) (ver inputs)
    // si se pasa la validacion, se ejecuta handleSubmit, y en values obtendremos un objeto con los datos que cargó el usuario en el form (v265)
    const submit = handleSubmit( (values) => {
        // superada la validacion, ejecuto la funcion login(), definida en src\stores\auth.js, pasandole el objeto con las credenciales cargadas por el usuario en el form (v268)
        auth.login(values)
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

        <v-alert
            class="my-5"
            type="error"
            :title="auth.erroMsg"
            v-if="auth.hasError"
        ></v-alert>

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
