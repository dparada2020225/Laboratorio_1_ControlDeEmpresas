const Usuario = require('../models/usuario.model');
const Empresa = require('../models/Empresa.model');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt');



function UsuarioDefault(req, res) {
    var modeloUsuario = new Usuario();

    Usuario.find({ email: "admin@gmail.com", nombre: "Admin" }, (err, usuarioEncontrado) => {
        if (usuarioEncontrado.length > 0) {
            console.log({ mensaje: "ya se ha creado el usuario del Administrador" })
        } else {
            modeloUsuario.nombre = "Admin";
            modeloUsuario.email = "admin@gmail.com";
            modeloUsuario.password = "123456";
            modeloUsuario.rol = "Admin";
            bcrypt.hash(modeloUsuario.password, null, null, (err, passwordEncryptada) => {
                modeloUsuario.password = passwordEncryptada
                modeloUsuario.save((err, usuarioGuardado) => {
                    if (err) console.log({ mensaje: 'error en la peticion ' })
                    if (!usuarioGuardado) console.log({ mensaje: 'error al crear usuario por defecto ' })
                    console.log({ Usuario: usuarioGuardado })

                })
            })
        }
    })

}


function Login(req, res) {
    var parametros = req.body;

    Usuario.findOne({ email: parametros.email }, (err, usuarioEncontrado) => {
        if (err) return res.status(500).send({ mensaje: 'error en la peticion ' });
        if (usuarioEncontrado) {
            bcrypt.compare(parametros.password, usuarioEncontrado.password, (err, Verificaciondepasswor) => {
                if (Verificaciondepasswor) {
                    return res.status(200).send({ token: jwt.crearToken(usuarioEncontrado) })
                } else {
                    return res.status(500).send({ mensaje: 'la contraseña no coincide' })
                }
            })
        } else {
            return res.status(500).send({ mensaje: 'El usuario nose ha podido identificar' })
        }
    })
}

function crearEmpresa(req, res) {
    var modeloEmpresa = new Empresa();
    var modeloUsuario = new Usuario();

    var parametros = req.body;
    if (req.user.rol = "Admin") {
        if (parametros.nombre && parametros.descripcion) {
            Empresa.find({ nombre: parametros.nombre }, (err, EmpresaEncontrada) => {
                if (EmpresaEncontrada.length > 0) {
                    return res.status(500).send({ mensaje: "esta empresa ya esta registrada" })
                } else {
                    modeloEmpresa.nombre = parametros.nombre,
                        modeloEmpresa.descripcion = parametros.descripcion

                    modeloEmpresa.save((err, EmpresaGuardada) => {
                        if (err) return res.status(500).send({ mensaje: 'error en la peticion ' });
                        if (!EmpresaGuardada) return res.status(500).send({ mensaje: 'error al guardar la empresa ' })
                        return res.status(200).send({ empresa: EmpresaGuardada })

                    })

                    modeloUsuario.nombre = parametros.nombre;
                    modeloUsuario.email = parametros.nombre + "@gmail.com";
                    modeloUsuario.password = "123456";
                    modeloUsuario.rol = "Empresa";
                    bcrypt.hash(modeloUsuario.password, null, null, (err, passwordEncryptada) => {
                        modeloUsuario.password = passwordEncryptada
                        modeloUsuario.save((err, usuarioGuardado) => {
                            if (err) return res.status(500).send({ mensaje: 'error en la peticion ' });
                            if (!usuarioGuardado) return res.status(500).send({ mensaje: 'error al guardar usuario de la empresa' })
                            console.log({ Usuario: usuarioGuardado })

                        })
                    })

                }
            })
        } else {
            return res.status(500).send({ mensaje: "envie todos los parametros obligatorios" })
        }

    } else {
        return res.status(500).send({ mensaje: 'error no tiene permisos de crear empresas' })

    }
}

function EditarEmpresa(req, res) {
    var idEmpresa = req.params.idEmpresa;
    var idUsuario = req.params.idUsuario;
    var parametros = req.body;


    if (req.user.rol = "Admin") {
        Empresa.findByIdAndUpdate(idEmpresa, parametros, { new: true }, (err, empresaEditada) => {
            if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
            if (!empresaEditada) return res.status(404).send({ mensaje: 'Error al Editar el Empresa' });
            return res.status(200).send({ EmpresaEditada: empresaEditada });
        })


        Usuario.findByIdAndUpdate(idUsuario, { nombre: parametros.nombre, email: parametros.nombre + "@gmail.com" }, { new: true }, (err, UserEditada) => {
            if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
            if (!UserEditada) return res.status(404).send({ mensaje: 'Error al Editar el usuario de la empresa' });
            //return res.status(200).send({ UseruarioEditado: UserEditada});
            console.log({ UseruarioEditado: UserEditada })
        })
    } else {
        return res.status(500).send({ mensaje: 'error no tiene permisos de editar empresas' })
    }
}

function EliminarEmpresa(req, res) {
    var idEmpresa = req.params.idEmpresa;
    var idUser = req.params.idUser;


    if (req.user.rol = "Admin") {
        Empresa.findByIdAndDelete(idEmpresa, (err, empresaEliminada) => {
            if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
            if (!empresaEliminada) return res.status(404).send({ mensaje: 'Error al eliminar el Empresa' });
            return res.status(200).send({ EmpresaEliminada: empresaEliminada });
        })

        Usuario.findByIdAndDelete(idUser, (err, UsuarioEliminado) => {
            if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
            if (!UsuarioEliminado) return res.status(404).send({ mensaje: 'Error al eliminar al usuario de la empresa' });
            return res.status(200).send({ UsuarioEliminado: UsuarioEliminado });
        })
    } else {
        return res.status(500).send({ mensaje: 'error no tiene permisos de eliminar empresas' })
    }
}



module.exports = {
    UsuarioDefault,
    Login,
    crearEmpresa,
    EditarEmpresa,
    EliminarEmpresa
}