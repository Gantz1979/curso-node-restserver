const { response, request } = require('express');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

const validarJWT = async( req = request, res = response, next ) => {

  const token = req.header('x-token');
  
  if ( !token ) {
    return res.status(401).json({
      msg: 'No hay token en la petición'
    });
  }
  
  try {

    const { uid } = jwt.verify( token, process.env.SECRETORPRIVATEKEY );
    const usuarioAuth = await Usuario.findById(uid);

    //validar si encontró usuario por uid
    if (!usuarioAuth) {
      return res.status(401).json( {
        msg: 'Token no valido - usuario no existe en BD'
     });
    }
     
    //verificar si el uid tiene estado en true
    if ( !usuarioAuth.estado ) {
      return res.status(401).json( {
         msg: 'Token no valido - usuario con estado false'
      });
    }
    req.usuario = usuarioAuth;
    next();
  } catch (error) {
    
    console.log(error);
    res.status(401).json({
      msg: 'Token no valido'
    })
  }

}



module.exports = {

  validarJWT
}