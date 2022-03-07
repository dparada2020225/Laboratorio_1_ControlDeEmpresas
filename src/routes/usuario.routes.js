const express = require('express');
const usuarioControlador = require('../controllers/usuario.controller');
const md_autenticacion = require('../middlewares/autenticacion');

const api = express.Router();


api.post('/login', usuarioControlador.Login);// Login de Administrador y de empresas
api.post('/crearEmpresa',md_autenticacion.Auth, usuarioControlador.crearEmpresa); // Crear la empresa
api.put('/editarEmpresa/:idEmpresa/:idUsuario',md_autenticacion.Auth, usuarioControlador.EditarEmpresa);// Editar empresa y su usuario de empresa
api.delete('/eliminarEmpresa/:idEmpresa/:idUser',md_autenticacion.Auth, usuarioControlador.EliminarEmpresa);// Eliminar empresa y su usuario de empresa

module.exports = api;