<script setup>
import { RouterView } from 'vue-router'
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
          <v-btn :to="{name: 'home'}">
            Bienes Raices - VueFire
          </v-btn>
        </template>

        <!-- append posiciona al elemento a la derecha del navbar -->
        <template v-slot:append>
          <v-btn :to="{name: 'home'}">
            Inicio
          </v-btn>
          <v-btn :to="{name: 'login'}">
            Login
          </v-btn>
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