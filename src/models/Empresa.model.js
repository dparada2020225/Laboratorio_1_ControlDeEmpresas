const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EmpresaSchema = new Schema({
    nombre: String,
    descripcion: String,
    Empleados:[{
        nombre: String,
        puesto: String,
        departamento: String,}]
    
})

module.exports = mongoose.model('Empresas', EmpresaSchema);