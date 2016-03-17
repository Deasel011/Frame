/**
 * Created by deasel on 2016-03-15.
 */
/* Declarations and imports*/{
    var amqp = require('amqplib/callback_api');
    var http = require('http');
    var server = require('./server.js');
    var webServer = http.createServer(function(req,res){
        res.writeHead(200,{'Content-Type':'text/plain'});
        res.end('Pub/Sub server running on port '+server.port);
    }).listen(server.port);//création du serveur http
    var io = require('socket.io').listen(webServer);//module pour recevoir des messages par socket
}

amqp.connect('amqp://localhost',function(err,conn){
    conn.createChannel(function(err,ch){
        var ex = 'frame';

        ch.assertExchange(ex,'fanout',{durable:true});




        /**
         * Doc receive message
         * Ici nous gérons toute la réception de message HTTP
         */
        io.sockets.on('connection', function(instance){
            /* Nouvelle trame */
            instance.on('bundledFrame', function(data){
                console.log(data);
                ch.publish(ex,'',new Buffer(JSON.stringify(data)));
                console.log("[x] Sent %s"+ JSON.stringify(data))
            });
        });


    });
});