const { response, request } = require('express');
const Usuario      = require('../models/usuario');
const bcryptjs     = require('bcryptjs');
const { generarJWT } = require('../helpers/generar-jwt');
const { googleVerify } = require('../helpers/google-verify');

const login = async( req, res = response ) => {

  const { correo, password } = req.body;

  try {

    //verificar si el email existe
    const usuario = await Usuario.findOne({ correo });
    if ( !usuario ) {
        return res.status(400).json( {
            msg: 'Usuario / Password no son correctos - usuario'
        });
    }

    //si el usuario está activo
    if ( !usuario.estado ) {   //false
      return res.status(400).json( {
        msg: 'Usuario / Password no son correctos - estado:false'
      });
    }

    //verificar la contraseña
    const validPass = bcryptjs.compareSync( password, usuario.password);
    if ( !validPass ) {
      return res.status(400).json( {
        msg: 'Usuario / Password no son correctos - passwword'
      });
    }

    //Generar el JWT
    const token = await generarJWT( usuario.id );

    res.json({
      usuario,
      token
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({   //palabra return opcional
      msg: 'Hable con el administrador'
    })
  }

}

const googleSignin = async( req = request, res = response) => {

  const {id_token} = req.body;

  try {

    const { nombre, correo, img } = await googleVerify( id_token);

    let usuario = await Usuario.findOne({ correo });

    if ( !usuario ) { 
      //crear usuario
      const data = {
        nombre,
        correo,
        password: ':P',
        img,
        google: true

      }

      usuario = new Usuario( data );
      await usuario.save();

    }

    //Si el usuario en BD tiene estado false
    if ( !usuario.estado ) {
        return res.status(401).json( {
          msg: 'Hable con el administrador, usuario bloqueado'
        })
    }

    //generar el JWT
    const token = await generarJWT( usuario.id );

    res.json({
      usuario,
      token
    });
    
  } catch (error) {
    res.status(400).json( {
      msg: 'Token de Google no es valido'
    })
  }
  
}


module.exports = {
  login,
  googleSignin
}