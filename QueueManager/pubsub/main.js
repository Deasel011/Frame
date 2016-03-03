/**
 * Created by deasel on 2016-03-02.
 */
/* Declarations and imports*/{
var mubsub = require('mubsub');//module pub/sub de MongoDB Merci a Scott Nelson <3
var db = require('./db.js');//informations de connections de la BD
var funct = require('./funct.js');//fonctions appellées dans les events de canaux
var client = mubsub(db.url);//connection à la BD a travers le module pub/sub de Scott Nelson
var http = require('http');//module http
var server = require('./server.js');//module qui contient les information du serveur http de pubsub
var webServer = http.createServer(function(req,res){
        res.writeHead(200,{'Content-Type':'text/plain'});
        res.end('Pub/Sub server running on port '+server.port);
    }).listen(server.port);//création du serveur http
var io = require('socket.io').listen(webServer);//module pour recevoir des messages par socket
//var ioClient = require('socket.io-client');//module pour envoyer des messages par socket
var CHANNEL=['accep','prod','dev'];
}

/**
 * Doc Main.js
 * Les fonctions de chaque canal sont les mêmes d'un environnement à l'autre,
 * ce pourquoi seules les fonctions de Acceptations sont documentées.
 *
 * C'est dans ce Node que toute la logique d'acheminement des message est
 * complétée.
 */


/**
 * Doc receive message
 * Ici nous gérons toute la réception de message HTTP
 */
io.sockets.on('connection', function(instance){
    /* Nouvelle trame individuelle */
    instance.on('newFrame', function(data){
        funct.publish(Objects.keys(data)[0],Objects.keys(data)[1]);
    });
    /* Nouvelle trame pour tout les canaux */
    instance.on('bundledFrame', function(data){
        for(var i=0;i<db.CHANNELS.length;i++){
            var channel = client.channel(db.CHANNELS[i]);
            funct.publish(channel,data);
        }
    });
    /* Type Message 3 */
});

/* Acceptation */
/**
 * Doc init <channel>
 *     Initialisation du canal<channel>
 * @type {Channel}
 */
var accep = client.channel(db.CHANNELS[0], {size: 100000, max:500});

/**
 * Doc getFromTime
 * Message recu lorsqu'un serveur vient de se reconnecter
 * au canal et veux les trames à partir de lorsqu'il s'est
 * déconnecté.
 */
accep.subscribe('getFromTime', function(message){
    funct.getFromTime(message,db.CHANNELS[0]);
});

/**
 * *DEPRECATED* Doc emitFrames <channel>
 *     Envoie d'une trame à un canal en particulier
 */
accep.subscribe('emitFrames', function(message){
//NOT NECESSARY
});

/**
 * *DEPRECATED* Doc publishFrame on newFrame <channel>
 *     Publie une trame sur le canal désigné
 */
accep.subscribe('newFrame', function(message){
    funct.publish(db.CHANNELS[0],message);
});


/**
 * Doc error <channel>
 *     Comportement du serveur lorsque survient une erreur
 */
accep.on('error', function(){
//À implémenter
});

/* Developpement et Production */{
/* Developpement */
var devel = client.channel(db.CHANNELS[1], {size: 100000, max:500});

devel.subscribe('getFromTime', function(message){

});

devel.subscribe('emitFrames', function(message){

});

devel.on('error', function(){

});

/* Production */
var produ = client.channel(db.CHANNELS[2], {size: 100000, max:500});

produ.subscribe('getFromTime', function(message){

});

produ.subscribe('emitFrames', function(message){

});

produ.on('error', function(){

});
}