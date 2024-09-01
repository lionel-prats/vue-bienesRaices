// hgelper para formatear los precios de las propiedades invocandolo desde src\views\admin\AdminView.vue (http://localhost:5173/admin/propiedades) (v293)
// al ser una sola linea de codigo podemos omitir el return y las llaves de apertuar y cierre (v303)
export const propertyPrice = (price) => 
    Number(price).toLocaleString("es-AR" , { 
        style: "currency", 
        currency: "ARS" 
    }) 

// otra sintaxis para el helper propertyPrice() (con return y llaves de ap2ertura y cierre) (v303)
// export const propertyPrice = (price) => {
//     return Number(price).toLocaleString("es-AR" , { 
//         style: "currency", 
//         currency: "ARS" 
//     }) 
// }