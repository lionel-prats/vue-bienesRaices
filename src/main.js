import { createApp } from 'vue'
import { createPinia } from 'pinia'

// importaciones Vuetify (v260)
import 'vuetify/styles' // importo la hoja de estilos de Vuetify necesaria para todos los componentes (v260)
import { createVuetify } from 'vuetify' // importo la la funcion createVuetify de Vuetify (v260)
import * as components from 'vuetify/components' // importo los componentes de Vuetify (v260)
import * as directives from 'vuetify/directives' // importo las directivas de Vuetify (v260)
// fin importaciones Vuetify (v260)

// Firebase (v266)
import { VueFire, VueFireAuth } from "vuefire"
import { firebaseApp } from "./config/firebase"
// fin Firebase (v266)

import App from './App.vue'
import router from './router'

import './assets/main.css'
import '@mdi/font/css/materialdesignicons.css' // hoja de estilos de Material Design Icons (v270)

const app = createApp(App)

// configuracion Vuetify (v260)
const vuetify = createVuetify({
    components,
    directives
})
app.use(vuetify)
// fin configuracion Vuetify (v260)

// configuracion Firebase (v266)
app.use(
    VueFire,
    {
        firebaseApp, // credenciales
        modules: [VueFireAuth()]
    }
)
// fin configuracion Firebase (v266)

app.use(createPinia())
app.use(router)

app.mount('#app')
