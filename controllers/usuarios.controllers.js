const { response } = require('express');
const bcryptjs     = require('bcryptjs');

const Usuario = require('../models/usuario');

 
const usuariosGet = async(req, res = response) => {

  const { limite = 5, desde = 0 } = req.query; 
  const filtro = { estado:true};

  /*
  const usuarios = await Usuario.find( filtro )
        .skip( Number( desde ) )
        .limit( Number( limite ) );

  const total = await Usuario.countDocuments( filtro );
 */ // CODIGO MEJORADO ABAJO// CONCURRENTE
  
  const [total, usuarios] = await Promise.all( [    //EJECUTA LAS PROMESAS AL MISMO TIEMPO--> LA DE ARRIBA ESPERABA UNA PARA INICIAR LA SIGUIENTE
    Usuario.countDocuments( filtro ),
    Usuario.find( filtro )
           .skip( Number( desde ) )
           .limit( Number( limite ) ),
  ]);

  //total resultado
  const totalResultado = usuarios.length;

  res.json( {
    total,
    totalResultado,
    usuarios
  });
}

const usuariosPost = async(req, res = response) => {

  const { nombre, correo, password, rol } = req.body;
  const usuario = new Usuario( { nombre, correo, password, rol } );

  //encriptar contraseña
  const salt = bcryptjs.genSaltSync();
  usuario.password = bcryptjs.hashSync( password, salt)

  //guardar en BD
  await usuario.save();

  res.json( {
    usuario
  });
}

const usuariosPut = async(req, res = response) => {

  const { id } = req.params;
  const { _id, password, google, correo, ...resto } = req.body;

  //TODO: VAlidar contra BD
  if ( password ) {
     //encriptar la contraseña
     const salt = bcryptjs.genSaltSync();
     resto.password = bcryptjs.hashSync( password, salt)
  }

  const usuario = await Usuario.findByIdAndUpdate( id, resto, {new: true} ); // por defecto esta en false y retorna el objeto antes anterior al actualizado
  console.log(usuario);
 

  res.json( {
    usuario
  });

}

const usuariosPatch = (req, res = response) => {
  res.json( {
    msj: 'PATCH API - controlador'
  });
}

const usuariosDelete = async(req, res = response) => {

  const { id } = req.params;

  //Fisicamente lo borramos
  //const usuario = await Usuario.findByIdAndDelete( id );
  const usuario = await Usuario.findByIdAndUpdate( id,  {estado: false} , {new: true})

  res.json( usuario );
}

module.exports = {
  usuariosGet,
  usuariosPost,
  usuariosPut,
  usuariosPatch,
  usuariosDelete
}