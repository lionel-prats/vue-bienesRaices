<script setup>
import { RouterView } from 'vue-router'

import { useAuthStore } from "./stores/auth"

// la funcion storeToRefs() de Pinia permite aplicar destructuring a todo lo que sea reactivo de un store (ref, reactive y computed properties) (v275)
import { storeToRefs } from "pinia"

const auth = useAuthStore()

// aplicamos destructuring para obtener el computed property isAuth (v275)
const { isAuth } = storeToRefs(auth)

const { logout } = auth

</script>

<template>

  <v-card
    elevation="3"
    max-width="1200"
    class="mx-auto"
  >
    <v-layout>
      
      <!-- navbar superior -->
      <v-app-bar
        color="blue-darken-1"
      >
        <!-- prepend posiciona al elemento a la izquierda del navbar -->
        <template v-slot:prepend>
          <v-btn :to="{name: 'home'}">Bienes Raices - VueFire</v-btn>
        </template>

        <!-- append posiciona al elemento a la derecha del navbar -->
        <template v-slot:append>
          <div v-if="isAuth">
            <v-btn :to="{name: 'admin-propiedades'}">Admin</v-btn>
            <v-btn @click="logout">Cerrar Sesión</v-btn>
          </div>
          <div v-else>
            <v-btn :to="{name: 'home'}">Inicio</v-btn>
            <v-btn :to="{name: 'login'}">Login</v-btn>
          </div>
        </template>
      
      </v-app-bar>
      <!-- fin navbar superior -->

      <!-- contenido central -->
      <v-main>
        <v-container>
          <RouterView />
        </v-container>
      </v-main>
      <!-- fin contenido central -->

    </v-layout>
  </v-card>
  
</template>