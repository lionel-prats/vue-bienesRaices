import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

// importaciones Vuetify (v260)
import 'vuetify/styles' // importo la hoja de estilos de Vuetify necesaria para todos los componentes (v260)
import { createVuetify } from 'vuetify' // importo la la funcion createVuetify de Vuetify (v260)
import * as components from 'vuetify/components' // importo los componentes de Vuetify (v260)
import * as directives from 'vuetify/directives' // importo las directivas de Vuetify (v260)
// fin importaciones Vuetify (v260)

import App from './App.vue'
import router from './router'

const app = createApp(App)

// configuracion Vuetify (v260)
const vuetify = createVuetify({
    components,
    directives
})
app.use(vuetify)
// fin configuracion Vuetify (v260)

app.use(createPinia())
app.use(router)

app.mount('#app')
