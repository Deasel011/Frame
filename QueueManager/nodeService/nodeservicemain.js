/**
 * Created by deasel on 2016-03-02.
 */
/* Declarations and imports*/{
var http = require('http');
var server = require('./server.js');
var ioClient = require('socket.io-client');
var webService = http.createServer(function(req,res){
        res.writeHead(200,{'Content-Type':'text/plain'});
        res.end('Service for Exchange server running on port '+server.port);
}).listen(server.port);
var io = require('socket.io').listen(webService);
var funct = require('./funct.js');
}

/**
 *  Doc connections http
 *  Un client se connecte au exchange en http
 *  Un serveur http recoit la 'layer' socket pour recevoir des messages
 */
var connection = ioClient.connect('http://exchange:'+server.exchangeport);

/**
 * Doc message listener
 * Ici on a un event listener pour l'instance ou l'on
 * va recevoir tout les messages passés par socket.io
 * et socket.io-client
 */
io.sockets.on('connection', function(instance){
    /**
     * Doc getFromTime
     * Sur réception du message getFromTime avec argument une date,
     * le serveur va faire une requete sur la DB storage puis il lui
     * revient un curseur dont pour chaque document, il va envoyer un
     * message http au serveur pubsub
     */
    instance.on('getFromTime', function(data){
        funct.getFromTime(data.time,connection, data.channel);
    });

    /**
     * Doc bundledFrame
     * Petite fonction qui fait le relais entre pubsub et frameReceiver
     * (on limite les accès a pubsub aux clients de celui-ci et nodeService)
     */
    instance.on('bundledFrame', function(data){
        console.log('bundle received');
        connection.emit('bundledFrame', data)
    })


});