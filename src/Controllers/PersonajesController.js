import mongoose from "mongoose"
import * as fs from "fs"

const esquema = new mongoose.Schema({
    nombre:String, arma:String, armadura:String, magia:String, pnivel:Number, fecha:Date
},{versionKey:false})
const PersonajesModel = new mongoose.model("personajes",esquema)

export const getPersonajes = async(req,res) =>{
    try{
        const {id} = req.params
        const rows = 
        (id === undefined) ? await PersonajesModel.find() : await PersonajesModel.findById(id)
        return res.status(200).json({status:true,data:rows})
    }

    catch(error){
        return res.status(500).json({status:false,errors:[error]})
    }
}


export const savePersonaje = async (req,res) =>{
    try{
        const {nombre,arma,magia,pnivel,fecha} = req.body
        const validacion = validar(nombre,arma,magia,pnivel,fecha,req.file,"Y")
        if(validacion == ""){
            const nuevoPersonaje = new PersonajesModel({
                nombre:nombre,arma:arma,magia:magia,pnivel:pnivel,fecha:fecha,
                armadura:"/uploads/"+req.file.filename
            })
            return await nuevoPersonaje.save().then(
                () => { res.status(200).json({status:true,message:"Personaje guardado"})}
            )
        } 
        else{
            return res.status(400).json({status:false,errors:validacion})
        }
    }
    catch(error){
        return res.status(500).json({status:false,errors:[errors.message]})
    }
}


export const updatePersonaje = async (req,res) =>{
    try{
        const {id} = req.params
        const {nombre,arma,magia,pnivel,fecha} = req.body
        let armadura = ""
        let valores = {nombre:nombre,arma:arma,magia:magia,pnivel:pnivel,fecha:fecha}
        if(req.file != null){
            armadura = "/uploads/"+req.file.filename
            valores = {nombre:nombre,arma:arma,magia:magia,pnivel:pnivel,fecha:fecha,armadura:armadura}
            await eliminarImagen(id)
        }
        const validacion = validar(nombre,arma,magia,pnivel,fecha)
        if(validacion == ""){
            await PersonajesModel.updateOne({_id:id},{$set: valores})
            return res.status(200).json({status:true,message:"Personaje actualizado"})
        }
        else{
            return res.status(400).json({status:false,errors:validacion})
        }
    }
    catch(error){
        return res.status(500).json({status:false,errors:[error.message]})
    }
}


export const deletePersonaje = async(req,res) =>{
    try{
        const {id} = req.params
        await eliminarImagen(id)
        await PersonajesModel.deleteOne({_id:id})
        return res.status(200).json({status:true,message:"Personaje eliminado"})
    }
    catch(error){
        return res.status(500).json({status:false,errors:[error.message]})
    }
}


const eliminarImagen = async(id) =>{
    const personaje = await PersonajesModel.findById(id)
    const img = personaje.armadura
    fs.unlinkSync("./public/"+img)
}


const validar = (nombre,arma,magia,pnivel,fecha,img,sevalida) =>{
    var errors =[]
    if(nombre === undefined || nombre.trim() === ""){
        errors.push("El nombre del personaje No debe de estar vacio")
    }
    if(arma === undefined || arma.trim() === ""){
        errors.push("El nombre del arma NO debe estar vacio")
    }
    if(magia === undefined || magia.trim() === ""){
        errors.push("El nombre de la magia NO debe estar vacio")
    }
    if(pnivel === undefined || pnivel.trim() === "" || isNaN(pnivel)){
        errors.push("El nivel del personaje NO debe estar vacio y debe ser numerico")
    }
    if(fecha === undefined || fecha.trim() === "" || isNaN(Date.parse(fecha))){
        errors.push("El la fecha NO debe estar vacia y debe ser valida")
    }
    if(sevalida === "Y" && img === undefined){
        errors.push("Selecciona un imagen en formato JPG o PNG")
    }
    else{
        if(errors != ""){
            fs.unlinkSync("./public/uploads/"+img.filename)
        }
    }
    return errors
}