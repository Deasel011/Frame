/**
 * Created by deasel on 2016-03-03.
 */
/* Declarations and imports*/{
var dbWriter = require('./io/dbWriter.js');//fonctions appellées dans les events de canaux
//var getter = require('./io/frameRetreiver.js');//Pour un getter des trames si on va les chercher par REST de AVL
var sender = require('./io/sender.js');
var http = require('http');//module http
var server = require('./server.js');//module qui contient les information du serveur http de pubsub
var webServer = http.createServer(function(req,res){
    res.writeHead(200,{'Content-Type':'text/plain'});
    res.end('FrameReceiver server running on port '+server.port);
}).listen(server.port);//création du serveur http
var ioClient = require('socket.io-client');
var io = require('socket.io').listen(webServer);//module pour recevoir des messages par socket
/* Déclarations pour réception UDP */{
    var PORT = 3001;
    var HOST = '127.0.0.1';
    var dgram = require('dgram');
    var udpserver = dgram.createSocket('udp4');
}
}

/**
 * Doc FrameReceiver/index.js
 * Lorsqu'une nouvelle trame est disponible, il faut:
 * a) L'inscrire dans la BD de stockage
 * b) L'envoyée au service node du queue manager
 */

/**
 * Doc Listener
 * Pour l'instant, recoit les trames par UDP,
 * à voir le mode de réception des trames
 */
udpserver.on('listening', function(){
  console.log('server listening on UDP port 3001');
});

udpserver.bind(PORT,HOST);

var connection = ioClient.connect('http://'+server.host+':'+server.serviceport);

udpserver.on('message', function(data, remote) {
    //if(format.isValid(data)){
        //dbWriter.write(data);
    connection.emit('bundledFrame',data, function(err){
        if(err)throw err;
        console.log('data emitted');
    });
        //sender.send(data);
    //}
});