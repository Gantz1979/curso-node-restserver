const { response } = require('express')
 
const usuariosGet = (req, res = response) => {

  const { q, apikey } = req.query; 

  res.json( {
    msj: 'GET API - controlador',
    q,
    apikey
  });
}

const usuariosPost = (req, res = response) => {

  const { nombre, edad } = req.body;

  res.json( {
    msj: 'POST API - controlador',
    nombre,
    edad
  });
}

const usuariosPut = (req, res = response) => {

  const { id } = req.params;
  res.json( {
    msj: 'PUT API - controlador',
    id
  });
}

const usuariosPatch = (req, res = response) => {
  res.json( {
    msj: 'PATCH API - controlador'
  });
}

const usuariosDelete = (req, res = response) => {
  res.json( {
    msj: 'DELETE API - controlador'
  });
}

module.exports = {
  usuariosGet,
  usuariosPost,
  usuariosPut,
  usuariosPatch,
  usuariosDelete
}