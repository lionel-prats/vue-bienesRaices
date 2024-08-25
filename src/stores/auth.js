import { ref, computed, onMounted } from "vue"
import { defineStore } from "pinia"

// importo el composable de autenticacion de Firebase (v267)
import { useFirebaseAuth } from "vuefire" 

// importo la funcion signInWithEmailAndPassword() de Firebase (v267)
// con signInWithEmailAndPassword() realizaremos la peticion a la API de Firebase intentando autenticar al usuario (v267)
// importo la funcion onAuthStateChanged() de Firebase (v274)
// onAuthStateChanged() va a intentar recuperar el inicio de sesion previo del usuario (v274)
// la vamos a mandar a llamar cuando se monte  este store (con onMounted de Vue) (v274)
// importo la funcion signOut() de Firebase (v276)
// signOut() sirve para cerrar la sesion de usuario autenticado en el servidor de Firebase
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth" 

// importo el composable o el hook useRouter de "vue-router" (v276)
import { useRouter } from "vue-router"

export const useAuthStore = defineStore("auth", () => {

    const router = useRouter()

    // mando llamar el composable de autenticacion de Firebase (v267)
    // esta linea esta conectando el backend en Firebase con mi app Vue (v267)
    const auth = useFirebaseAuth()
    
    // state para almacenar un objeto con la informacion de un usuario autenticado (respuesta de la API de Firebase) (v272)
    // inicialmente va a ser null, lo que indica que no hay usuario autenticado
    const authUser = ref(null)

    // state para almacenar el posible mensaje de error cuando en un intento de login las credenciales son invalidas (respuesta de la API de Firebase) (v271)
    const erroMsg = ref("")

    const errorCodes = {
        "auth/invalid-credential" : "Credenciales inválidas"
    }

    onMounted( () => {
        // apenas se monta este store ejecuto la funcion onAuthStateChanged de Firebase (v274)
        // como primer argumento ercibe la conexion al backend, y como segundo argumento un callback (v274)
        // con onAuthStateChanged() podemos saber si hay una sesion activa de algun usuario autenticado
        // user sera null en caso de que no haya sesion activa alguna, o sera un objeto con info de la sesion de un usuario autenticado (v274)
        onAuthStateChanged(auth, (user) => {
            if (user) {
                // si hay sesion de un usuario autenticado, guardo en el state la info de esa sesion
                authUser.value = user
            }
        }) 
    })

    // esta funcion se ejecuta desde la funcion submit() definida en src\views\LoginView.vue, y hace la peticion a la API de Firebase pasando las credenciales del usuario que se esta queriendo autenticar
    const login = ({email, password}) => {

        // intento autenticar al usuario con la funcion de Firebase
        // como argumentos, le pasamos la conexion al backend, y las credenciales del usuario que se quiere autenticar
        signInWithEmailAndPassword(auth, email, password) 
            // si las credenciales son correctas, entra al then y el usuario se ha autenticado
            // userCredential es un objeto, la respuesta de la API de Firebase si el usuario se ha autenticado (v272) 
            .then((userCredential) => {
                // cargo en el state la info del usuario autenticado (v272)
                const user = userCredential.user;
                authUser.value = user
                router.push({name: 'admin-propiedades'})
            })
            // si las credenciales no son validas, entra al catch, y capturamos el mensaje de error para renderizar en el alerta
            .catch((error) => {
                erroMsg.value = errorCodes[error.code]
            });
    }

    const logout = () => {
        // cierro la sesion de usuario autenticado en el servidor de Firebase (v276)
        signOut(auth).then( () => {
            authUser.value = null
            router.push({name: 'login'}) 
        }).catch((error) => {
            console.log(error);
        });
    }

    const hasError = computed( () => {
        return erroMsg.value
    })
    
    const isAuth = computed( () => {
        return authUser.value
    })

    return {
        // states
        erroMsg,

        // getters
        hasError,
        isAuth,

        // acciones
        login,
        logout,
    }
})