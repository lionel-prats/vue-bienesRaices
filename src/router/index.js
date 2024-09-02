import { createRouter, createWebHistory } from 'vue-router'

// importo la funcion onAuthStateChanged() de Firebase (v278)
import { onAuthStateChanged } from "firebase/auth" 
// importo el composable de autenticacion de vuefire (v278)
import { useFirebaseAuth } from "vuefire" 

import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/propiedades/:id',
      name: 'propiedad',
      component: () => import("../views/PropiedadView.vue"),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import("../views/LoginView.vue"),
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import("../views/admin/AdminLayout.vue"),
      meta: { requiresAuth: true }, // Route Meta Field (v277)
      children: [ // rutas anidadas (v273)
        {
          path: 'propiedades', // == '/admin/propiedades' (v308)
          name: 'admin-propiedades',
          component: () => import("../views/admin/AdminView.vue"),
          // meta: { requiresAuth: true }, // Route Meta Field (v277)
        },
        {
          path: 'nueva', // == '/admin/nueva' (v308)
          name: 'nueva-propiedad',
          component: () => import("../views/admin/NuevaPropiedadView.vue"),
          // meta: { requiresAuth: true }, // Route Meta Field (v277)
        },
        {
          path: 'editar/:id', // == '/admin/editar/:id' (v308)
          name: 'editar-propiedad',
          component: () => import("../views/admin/EditarPropiedadView.vue"),
          // meta: { requiresAuth: true }, // Route Meta Field (v277)
        },
      ]
    },
  ]
})

// Guard de navegacion (v277)
// este codigo se va a ejecutar cada vez que se quiera acceder a cualquiera de las URLs definidas en este archivo
router.beforeEach( async(to, from, next) => {
  // to = Objeto -> info de a que URL estoy queriendo acceder
  // from = Objeto -> info de desde que URL estoy queriendo acceder
  // next = ?
  const requiresAuth = to.matched.some( (url) => url.meta.requiresAuth )
  if(requiresAuth) {
    // url, hay que comporobar que el usuario este autenticado (v277)
    try {
      await authenticateUser()
      next()
    } catch (error) { // no hay usuario autenticado, se ejecuta el catch
      console.log(error);
      next({name: "login"}) // redirijo al usuario no autenticado al login
    }
  } else { // la url no esta protegida, mostramos la vista (v277)
    next()
  }
})

function authenticateUser() { // v278
  const auth = useFirebaseAuth() 
  return new Promise( (resolve, rejected) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe() // observer (v278)
      if (user) {
        resolve() // retornamos que existe sesion de usuario autenticado
      } else {
        rejected() // retornamos que NO existe sesion de usuario autenticado
      }
    }) 
  })
}

export default router
