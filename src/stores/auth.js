import { ref, computed, onMounted } from "vue"
import { defineStore } from "pinia"
import { useFirebaseAuth } from "vuefire" // v267
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth" // v267|v274

export const useAuthStore = defineStore("auth", () => {

    const auth = useFirebaseAuth() // v267
    const authUser = ref(null)

    const erroMsg = ref("")

    const errorCodes = {
        "auth/invalid-credential" : "Credenciales inválidas"
    }

    onMounted( () => {

        // apenas se monta este store valido si hay usuario autenticado, usando la funcion onAuthStateChanged de Firebase (v274)
        onAuthStateChanged(auth, (user) => {
            if (user) {
                authUser.value = user
            }
        }


        ) 
    })

    const login = ({email, password}) => {
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                authUser.value = user
                console.log(authUser.value);
            })
            .catch((error) => {
                erroMsg.value = errorCodes[error.code]
            });
    }

    const hasError = computed( () => {
        return erroMsg.value
    })

    return {
        // states
        hasError,
        erroMsg,

        // getters
        
        // acciones
        login,
    }
})