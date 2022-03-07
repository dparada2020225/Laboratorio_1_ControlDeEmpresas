const Empresa = require('../models/Empresa.model');
const PDF = require('pdfkit');
const fs = require('fs');
const xl = require('excel4node');
const { default: mongoose } = require('mongoose');
//const { path } = require('express/lib/application');

function agregarEmpleado(req, res) {
    var IdEmpresa = req.params.IdEmpresa;
    var parametros = req.body;

    if (req.user.rol == "Empresa") {
        Empresa.findById(IdEmpresa, (err, empresaEncontrada) => {
            if (err) return res.status(500).send({ mensaje: "error en la peticion" });
            if (!empresaEncontrada) return res.status(404).send({ mensaje: "error al encontrar empresa " })
    
            if (empresaEncontrada.nombre == req.user.nombre) {

                if (parametros.nombre && parametros.puesto && parametros.departamento) {

                    Empresa.findByIdAndUpdate(IdEmpresa, { $push: { Empleados: { nombre: parametros.nombre, puesto: parametros.puesto, departamento: parametros.departamento } } }, { new: true }, (err, empleadoAgregado) => {
                        if (err) return res.status(500).send({ mensaje: 'Error en  la peticion' });
                        if (!empleadoAgregado) return res.status(500).send({ mensaje: 'Error al agregar empleado en empresa' });
        
                        return res.status(200).send({ empleado: empleadoAgregado })
        
                    })
        
                } else {
                    return res.status(500).send({ mensaje: 'Debe enviar los parametros necesarios.' })
                }
    
            }  else {
                return res.status(500).send({ mensaje: 'No tiene permiso para agregar empleados a esta empresa' })
            }
        })

    } else {
        return res.status(500).send({ mensaje: 'no puede egregar empleados, no es una empresa' })
    }

}



function EditarEmpleado(req, res) {
    const IdEmpleado = req.params.IdEmpleado;
    const parametros = req.body;

    Empresa.findOne({ Empleados: { $elemMatch: { _id: IdEmpleado } } }, (err, empleadoEncontrado)=>{
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if (!empleadoEncontrado) return res.status(500).send({ mensaje: 'Error al encontrar el empleado' });

        if (req.user.rol == "Empresa") {
            if (empleadoEncontrado.nombre == req.user.nombre) {
                
                Empresa.findOneAndUpdate({ Empleados: { $elemMatch: { _id: IdEmpleado } } },
                    { "Empleados.$.nombre": parametros.nombre }, { new: true }, (err, empleadoActualizado) => {
                            if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
                            if (!empleadoActualizado) return res.status(500).send({ mensaje: 'Error al editar el empleado' });
            
                              return res.status(200).send({ EmpleadoEditado: empleadoActualizado })
                    })

            }  else {
                return res.status(500).send({ mensaje: 'No tiene permiso para editar empleados de esta empresa' })
            }
    
        } else {
            return res.status(500).send({ mensaje: 'no puede editar empleados, no es una empresa' })
        }  
        
    })
   
}

function EliminarEmpleado(req, res) {
    const IdEmpleado = req.params.IdEmpleado;

        Empresa.findOne({ Empleados: { $elemMatch: { _id: IdEmpleado } } }, (err, empleadoEncontrado)=>{
            if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
            if (!empleadoEncontrado) return res.status(500).send({ mensaje: 'Error al encontrar el empleado' });
    
            if (req.user.rol == "Empresa") {
                if (empleadoEncontrado.nombre == req.user.nombre) {
                    
                    Empresa.findOneAndUpdate({ Empleados: { $elemMatch: { _id: IdEmpleado } } },
                        { $pull: { Empleados: { _id: IdEmpleado } } }, { new: true }, (err, EmpleadoEliminado) => {
                            if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
                            if (!EmpleadoEliminado) return res.status(500).send({ mensaje: 'Error al eliminar el Proveedor' });
                
                            return res.status(200).send({ EmpleadoEliminado: EmpleadoEliminado })
                        })
    
                }  else {
                    return res.status(500).send({ mensaje: 'No tiene permiso para eliminar empleados de esta empresa' })
                }
        
            } else {
                return res.status(500).send({ mensaje: 'no puede eliminar empleados, no es una empresa' })
            }  
            
        })
}

//busquedas de empleado/s

function ObtenerNumeroEmpleados(req, res) {
    var IdEmpresa = req.params.idEmpresa;

    Empresa.findById(IdEmpresa, (err, empresaEncontrada) => {
        if (err) return res.status(500).send({ mensaje: "error en la peticion" });
        if (!empresaEncontrada) return res.status(404).send({ mensaje: "error al encontrar empresa " })

        if (empresaEncontrada.nombre == req.user.nombre) {
            let tabla = []
            for (let i = 0; i < empresaEncontrada.Empleados.length; i++) {
                tabla.push(`nombre: ${empresaEncontrada.Empleados[i].nombre}, puesto: ${empresaEncontrada.Empleados[i].puesto}, departamento :${empresaEncontrada.Empleados[i].departamento}`)
            }
            return res.status(200).send({ Numero_Empleados: empresaEncontrada.Empleados.length, Empleados: tabla });

        } else {
            return res.status(500).send({ mensaje: 'No tiene permiso para ver los empleados de esta empresa' })
        }
    })

}


function BusquedaXId(req,res) {
    var IdEmpresa = req.params.idEmpresa;
    var parametros = req.body;
   

    Empresa.findById(IdEmpresa, (err, empresaEncontrada) => {
        if (err) return res.status(500).send({ mensaje: "error en la peticion" });
        if (!empresaEncontrada) return res.status(404).send({ mensaje: "error al encontrar empresa " })

        if (empresaEncontrada.nombre == req.user.nombre) {
            
            Empresa.findOne({Empleados: {$elemMatch: {"_id": parametros.id}}},(err, empleado) => {
                if (err) return res.status(500).send({ mensaje: "error en la peticion" });
                if (!empresaEncontrada) return res.status(404).send({ mensaje: "error al encontrar empresa " })
                return res.status(200).send({ empleado: empleado})

            })

        } else {
            return res.status(500).send({ mensaje: 'No tiene permiso para ver los empleados de esta empresa' })
        }
    })
    
}

function BusquedaXNombre(req,res) {
    var IdEmpresa = req.params.idEmpresa;
    var parametros = req.body;
   

    Empresa.findById(IdEmpresa, (err, empresaEncontrada) => {
        if (err) return res.status(500).send({ mensaje: "error en la peticion" });
        if (!empresaEncontrada) return res.status(404).send({ mensaje: "error al encontrar empresa " })

        if (empresaEncontrada.nombre == req.user.nombre) {
            
            Empresa.aggregate([
                {
                    $match: { "_id": mongoose.Types.ObjectId(IdEmpresa) }
                },
                {
                    $unwind: "$Empleados"
                },
                {
                    $match: { "Empleados.nombre": { $regex: parametros.nombre, $options: 'i' } }
                }, 
                {
                    $group: {
                        "_id": "$_id",
                        "nombre": { "$first": "$nombre" },
                        "Empleados": { $push: "$Empleados" }
                    }
                }
            ]).exec((err, Encontrados) => {
                if(err) return res.status(500).send({ mensaje:"error en la peticion"})
                if(!Encontrados) return res.status(500).send({ mensaje:"error al encontrar empleados"})
                return res.status(200).send({ Empleado: Encontrados })
            })

        } else {
            return res.status(500).send({ mensaje: 'No tiene permiso para ver los empleados de esta empresa' })
        }
    })
    
}

function BusquedaXPuesto(req,res) {
    var IdEmpresa = req.params.idEmpresa;
    var parametros = req.body;
 

    Empresa.findById(IdEmpresa, (err, empresaEncontrada) => {
        if (err) return res.status(500).send({ mensaje: "error en la peticion" });
        if (!empresaEncontrada) return res.status(404).send({ mensaje: "error al encontrar empresa " })

        if (empresaEncontrada.nombre == req.user.nombre) {
            
            Empresa.aggregate([
                {
                    $match: { "_id": mongoose.Types.ObjectId(IdEmpresa) }
                },
                {
                    $unwind: "$Empleados"
                },
                {
                    $match: { "Empleados.puesto": { $regex: parametros.puesto, $options: 'i' } }
                }, 
                {
                    $group: {
                        "_id": "$_id",
                        "nombre": { "$first": "$nombre" },
                        "Empleados": { $push: "$Empleados" }
                    }
                }
            ]).exec((err, Encontrados) => {
                if(err) return res.status(500).send({ mensaje:"error en la peticion"})
                if(!Encontrados) return res.status(500).send({ mensaje:"error al encontrar empleados"})
                return res.status(200).send({ Empleado: Encontrados })
            })

        } else {
            return res.status(500).send({ mensaje: 'No tiene permiso para ver los empleados de esta empresa' })
        }
    })
}

function BusquedaXDepartamento(req,res) {
    var IdEmpresa = req.params.idEmpresa;
    var parametros = req.body;

    

    Empresa.findById(IdEmpresa, (err, empresaEncontrada) => {
        if (err) return res.status(500).send({ mensaje: "error en la peticion1" });
        if (!empresaEncontrada) return res.status(404).send({ mensaje: "error al encontrar empresa " })

        if (empresaEncontrada.nombre == req.user.nombre) {
            
            Empresa.aggregate([
                {
                    $match: { "_id": mongoose.Types.ObjectId(IdEmpresa) }
                },
                {
                    $unwind: "$Empleados"
                },
                {
                    $match: { "Empleados.departamento": { $regex: parametros.departamento, $options: 'i' } }
                }, 
                {
                    $group: {
                        "_id": "$_id",
                        "nombre": { "$first": "$nombre" },
                        "Empleados": { $push: "$Empleados" }
                    }
                }
            ]).exec((err, Encontrados) => {
                if(err) return res.status(500).send({ mensaje:"error en la peticion2"})
                if(!Encontrados) return res.status(500).send({ mensaje:"error al encontrar empleados"})
                return res.status(200).send({ Empleado: Encontrados })
            })

        } else {
            return res.status(500).send({ mensaje: 'No tiene permiso para ver los empleados de esta empresa' })
        }
    })
}

function TodosLosEmpleados(req,res) {
    var IdEmpresa = req.params.idEmpresa;
    var parametros = req.body;


    if (req.user.rol == "Admin") {

                
                Empresa.aggregate([
                    
                    {
                        $unwind: "$Empleados"
                    },
                    {
                        $match: { "Empleados.nombre": { $regex: parametros.nombre, $options: 'i' } }
                    }, 
                    {
                        $group: {
                            "_id": "$_id",
                            "nombre": { "$first": "$nombre" },
                            "Empleados": { $push: "$Empleados" }
                        }
                    }
                ]).exec((err, Encontrados) => {
                    if(err) return res.status(500).send({ mensaje:"error en la peticion"})
                    if(!Encontrados) return res.status(500).send({ mensaje:"error al encontrar empleados"})
                    return res.status(200).send({ Empleado: Encontrados })
                })
    

    } else {
        return res.status(500).send({ mensaje: 'no puede ver empleados, no es una empresa' })
    } 
    

    
    
}
//documentos


function CrearPDFEjemplo(req, res) {
    var doc = new PDF();

    //doc.pipe(fs.createWriteStream(__dirname+'ejemplo.pdf'))
    doc.pipe(fs.createWriteStream('pdf/ejemplo.pdf'))
    doc.text("Empleados ", {
        align: "center"
    })

    var parrafo = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    doc.text(parrafo, {
        columns: 3
    })

    doc.end();
    return res.status(200).send({ mensaje: "archivo generado" })
    console.log("archivo generado")

}
function CrearPDFConDB(req, res) {
    var IdEmpresa = req.params.idEmpresa;
    var doc = new PDF();

    Empresa.findById(IdEmpresa, (err, empresaEncontrada) => {
        if (err) return res.status(500).send({ mensaje: "error en la peticion" });
        if (!empresaEncontrada) return res.status(404).send({ mensaje: "error al encontrar empresa " })

        if (empresaEncontrada.nombre == req.user.nombre) {
            let tabla = []
            var j =0
            for (let i = 0; i < empresaEncontrada.Empleados.length; i++) {
                j=i+1
                tabla.push(`\n\n ${j}) \nNombre: ${empresaEncontrada.Empleados[i].nombre}, \nPuesto: ${empresaEncontrada.Empleados[i].puesto}, \nDepartamento :${empresaEncontrada.Empleados[i].departamento}`)
            }

            doc.pipe(fs.createWriteStream('pdf/Empleados' + empresaEncontrada.nombre + '.pdf'))
            doc.fillColor('gray').fontSize(24).text("Empleados " + empresaEncontrada.nombre, {
                align: "center"
            })

            doc.fillColor('black').fontSize(12).text(tabla,{ column: 3})
           
            doc.end();

            return res.status(200).send({ mensaje: "archivo generado", Numero_Empleados: empresaEncontrada.Empleados.length, Empleados: tabla });

        } else {
            return res.status(500).send({ mensaje: 'No tiene permiso para descargar los empleados de esta empresa' })
        }
    })
}

function CrearExelDB(req, res) {
    var IdEmpresa = req.params.idEmpresa;
    var doc = new PDF();

    Empresa.findById(IdEmpresa, (err, empresaEncontrada) => {
        if (err) return res.status(500).send({ mensaje: "error en la peticion" });
        if (!empresaEncontrada) return res.status(404).send({ mensaje: "error al encontrar empresa " })

        if (empresaEncontrada.nombre == req.user.nombre) {

            var wb = new xl.Workbook();
            var ws = wb.addWorksheet("Empleados " + empresaEncontrada.nombre);

            var style = wb.createStyle({
                font: {
                    color: '#040404',
                    size: 14
                }
            })
            var GrenS = wb.createStyle({
                font: {
                    color: '#388813',
                    size: 16
                }
            })

            ws.cell(1,1).string("Empleados de la empresa: ").style(GrenS)
            ws.cell(1,2).string(empresaEncontrada.nombre).style(style)
            ws.cell(3, 1).string("Nombre").style(GrenS)
            ws.cell(3, 2).string("Puesto").style(GrenS)
            ws.cell(3, 3).string("Departamento ").style(GrenS)

            ws.cell(3, 5).string("Numero de empleados").style(GrenS)
            ws.cell(3, 6).number(empresaEncontrada.Empleados.length).style(style)

            ws.column(1).setWidth(30)
            ws.column(2).setWidth(30)
            ws.column(3).setWidth(30)
            ws.column(5).setWidth(30)
            ws.column(6).setWidth(10)

            for (let i = 0; i < empresaEncontrada.Empleados.length; i++) {
                ws.cell(i + 4, 1).string(empresaEncontrada.Empleados[i].nombre).style(style)
                ws.cell(i + 4, 2).string(empresaEncontrada.Empleados[i].puesto).style(style)
                ws.cell(i + 4, 3).string(empresaEncontrada.Empleados[i].departamento).style(style)
            }

            function escribirExel() {
                wb.write('exel/Empleados' + empresaEncontrada.nombre + '.xlsx', (err, data) => {
                    if (err) return res.status(500).send({ mensaje: "error en la peticion" });
                    if (!data) return res.status(404).send({ mensaje: "error 2 " })

                })

            }

            if (fs.existsSync('exel/Empleados' + empresaEncontrada.nombre + '.xlsx')) {
                console.log("si existe")
                fs.unlinkSync('exel/Empleados' + empresaEncontrada.nombre + '.xlsx')
                console.log("ya no")
                escribirExel()
                console.log("creado nuevamente")
            } else {
                console.log("no existe")
                escribirExel()
                console.log("creado")

            }


            return res.status(200).send({ mensaje: "archivo generado", Numero_Empleados: empresaEncontrada.Empleados.length });

        } else {
            return res.status(500).send({ mensaje: 'No tiene permiso para ver el registro de empleados de esta empresa' })
        }
    })
}


module.exports = {
    agregarEmpleado,
    ObtenerNumeroEmpleados,
    EditarEmpleado,
    EliminarEmpleado,
    BusquedaXId,
    BusquedaXNombre,
    BusquedaXPuesto,
    BusquedaXDepartamento,
    TodosLosEmpleados,
    CrearPDFEjemplo,
    CrearPDFConDB,
    CrearExelDB
}