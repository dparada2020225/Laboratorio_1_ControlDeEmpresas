const express = require('express');
const empresaControlador = require('../controllers/empresa.controller');
const md_autenticacion = require('../middlewares/autenticacion');
const EmpresaModel = require('../models/Empresa.model');

const api = express.Router();


api.post('/agregarEmpleado/:IdEmpresa',md_autenticacion.Auth,empresaControlador.agregarEmpleado); // crear empleado a empresa 
api.put("/EditarEmpleado/:IdEmpleado",md_autenticacion.Auth,empresaControlador.EditarEmpleado) // editar empleado a empresa
api.put("/EliminarEmpleado/:IdEmpleado",md_autenticacion.Auth, empresaControlador.EliminarEmpleado) // eliminar empleado a empresa

//busquedas

api.get('/ObtenerNumeroEmpleados/:idEmpresa',md_autenticacion.Auth, empresaControlador.ObtenerNumeroEmpleados) // personal empresa actualmente y la cantidad de los mismos por empresa.
api.post("/empleadoXId/:idEmpresa",md_autenticacion.Auth,empresaControlador.BusquedaXId) //ID
api.post("/empleadoXNombre/:idEmpresa",md_autenticacion.Auth,empresaControlador.BusquedaXNombre) //Nombre
api.post("/empleadoXPuesto/:idEmpresa",md_autenticacion.Auth,empresaControlador.BusquedaXPuesto) //Puesto
api.post("/empleadoXDepartamento/:idEmpresa",md_autenticacion.Auth,empresaControlador.BusquedaXDepartamento) //Departamento
api.get("/TodosLosEmpleados/",md_autenticacion.Auth,empresaControlador.TodosLosEmpleados) //entre todos los empleados de todas las empresas token de admin


//pdfs y excels
api.get("/pdf",empresaControlador.CrearPDFEjemplo )// este es un ejemplo de pdf sin datos de la db
api.get("/pdf/:idEmpresa",md_autenticacion.Auth,empresaControlador.CrearPDFConDB )// pdf con los empleados por empresa
api.get("/excel/:idEmpresa",md_autenticacion.Auth,empresaControlador.CrearExelDB )// excel de empleados por empresa

module.exports = api;