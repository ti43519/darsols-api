import { Router } from "express"
import { getPersonajes,savePersonaje,updatePersonaje,deletePersonaje } from "../Controllers/PersonajesController.js"
import { subirImagen } from "../Middleware/Storage.js"
import { verificar } from "../Middleware/Auth.js"

 const rutas = Router()

 //rutas.get("/api/personajes", getPersonajes)
rutas.get("/api/personajes",verificar, getPersonajes)
rutas.get("/api/personajes/:id",verificar, getPersonajes)
rutas.post("/api/personajes",verificar, subirImagen.single("armadura"), savePersonaje)
rutas.put("/api/personajes/:id",verificar, subirImagen.single("armadura"), updatePersonaje)
rutas.delete("/api/personajes/:id",verificar, deletePersonaje)

 export default rutas