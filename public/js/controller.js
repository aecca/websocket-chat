/**
 * Chat Controller
 * @param {[type]} $scope Ambito del controlador ( like as 'this' )
 * @param {[type]} socket Socket Instance
 */
var ChatCtrl = function($scope, socket) {

   $scope.mensajes = [];
   $scope.usuarios = [];
   $scope.form = {};

   // Al inicializar
   socket.on('usuario:init', function(data){
       $scope.usuarios = data.usuarios;
       $scope.mensajes = data.mensajes;
   });

   // Nuevo usuario se une al chat
   socket.on('usuario:connection', function(data){
       $scope.usuarios.push(data.usuario);
       $scope.mensajes.push({
          'mensaje' : 'Se ha conectado',
          'usuario' : data.usuario
       });
   });

   // Nuevo Mensaje
   socket.on('usuario:mensaje' , function(data){
       $scope.mensajes.push({
          'usuario' : data.usuario,
          'mensaje' : data.mensaje
       });
       $scope.form.mensaje = '';
   });

   // Agun usuario se desconecta
   socket.on('usuario:disconnect', function(data){
      for(var i = 0; i < $scope.usuarios.length; i++) {
        if($scope.usuarios[i] == data.usuario) {
           delete $scope.usuarios[i];
           $scope.mensajes.push({
             'usuario': data.usuario,
             'mensaje' :'Se ha desconectado'
           });
        }
      }
   });

   /**
    * Funcion agregar usuario al chat
    */
   $scope.connect = function() {
       $scope.userConnect = true;
       socket.emit('action:usuario', {
          'usuario' : $scope.form.usuario
       });
   };

   /**
    * Funcion para Enviar mensaje
    */
   $scope.submit = function() {
      socket.emit('action:mensaje', {
         'usuario' : $scope.form.usuario,
         'mensaje' : $scope.form.mensaje
      });
   };

};

ChatCtrl.$inject = ['$scope', 'socket'];
app.controller('ChatCtrl', ChatCtrl);
