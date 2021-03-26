const Role = require('../models/role');
const Usuario = require('../models/usuario');

const esRoleValido = async(rol = '') => {

  const existeRol = await Role.findOne( { rol });
  if ( !existeRol ) {
      throw new Error(` El rol ${rol} no está registrado en la base de datos`);
  }
}

//verificar si el correo existe
const emailExiste = async( correo = '') => {

  const email  = await Usuario.findOne( { correo });

  if ( email ) {
    throw new Error(` El correo: ${correo}, ya está registrado`);
  }
}

//verificar si el id existe en la BD
const existeUsuarioPorId = async( id ) => {

  const existeUsuario  = await Usuario.findById( id );

  if ( !existeUsuario ) {
    throw new Error(` El ID no existe: ${id}`);
  }
}


module.exports = {
  esRoleValido,
  emailExiste,
  existeUsuarioPorId
}