var io = require('socket.io')();

// Memory Storage
var usuarios = {};
var mensajes = [];

// Utils
var fn = {
   array : function(collection){
      var arr = [];
      for(var u in collection)
         arr.push(collection[u]);
      return arr;
   }
};

/**
 * Listener on connection client socket
 * @param  socket Socket/IO client instance
 * @return  void
 */
io.on('connection', function (socket, session) {

   console.log('Socket client connection');
   console.log('Socket client id %s \n', socket.id);

   var id = socket.id;

   socket.emit('usuario:init', {
      'usuarios' : fn.array(usuarios),
      'mensajes' : mensajes
   });

   socket.on('action:usuario', function(data){
       usuarios[id] = data.usuario;
       io.emit('usuario:connection', {
          'usuario' : data.usuario
       });
   });

   socket.on('action:mensaje', function(data){
       usuarios[id] = data.usuario;
       io.emit('usuario:mensaje', {
          'mensaje' : data.mensaje,
          'usuario' : data.usuario
       });
       mensajes.push(data);
   });

   socket.on('disconnect', function(data) {
      if( usuarios[id]) {
        io.emit('usuario:disconnect', {
           'usuario':usuarios[id]
        });
        delete usuarios[id];
      }
   });

});

module.exports = io;