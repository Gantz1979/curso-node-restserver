const express = require('express')
const cors    = require('cors');
const { dbConnection } = require('../database/config');
class Server {

  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    this.usuariosRoutePath = '/api/usuarios';
    this.authPath          = '/api/auth';

    //conectar a base de datos
    this.conectarDB();
    
    //middelware
    this.middlewares();
    //rutas de mi app
    this.routes();
  }

  async conectarDB() {
    await dbConnection();
  }

  middlewares() {

    //CORS
     this.app.use(cors());

    //Lectura y parseo del body
    this.app.use( express.json() );

    //Directorio publico
    this.app.use( express.static('public') )
  }

  routes() {
    this.app.use(this.authPath , require('../routes/auth.routes'));
    this.app.use(this.usuariosRoutePath , require('../routes/usuarios.routes'));
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log('Servidor corriendo en puerto:', this.port);
    });
  }

}


module.exports = Server;