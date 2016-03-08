/**
 * Created by deasel on 2016-03-03.
 */
//TODO : gestion d'erreur sans crash!
/* Declarations and imports*/
var dbWriter = require('./io/dbWriter.js');//fonctions appellées dans les events de canaux
var http = require('http');//module http
var server = require('./server.js');//module qui contient les information du serveur http de pubsub
var MongoClient = require('mongodb').MongoClient;
var format = require('./format.js');//module qui contient les informations sur le format et qui permet de le parser
var ioClient = require('socket.io-client');

/**
 * Doc Connection Mongo
 * Afin de ne pas créer de traffic excessif, nous créons un pool afin de faire toutes
 * les requêtes d'écritures. Pour utiliser le pool, il faut tout entrer la logique
 * de serveur à l'intérieur de la fonction callback du client de connection!
 * C'est pourquoi le webserveur est instancié à l'intérieur du callback de la
 * connection!
 *
 * Pour créer un pool avec une autre base de donnée, procédé de la même facon,
 * mais lire la documentation spécifique pour voir s'il n'y a pas de facon plus
 * simple!
 */
MongoClient.connect('mongodb://localhost:12345/frame', function (err,db) {
    if(err) throw err;

    var webServer = http.createServer(function (req, res) {
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end('FrameReceiver server running on port ' + server.port);
    }).listen(server.port);//création du serveur http
    var io = require('socket.io').listen(webServer);//module pour recevoir des messages par socket
    /* Déclarations pour réception UDP */
    {
        var PORT = 3001;
        var HOST = '127.0.0.1';
        var dgram = require('dgram');
        var udpserver = dgram.createSocket('udp4');
    }

    /**
     * Doc FrameReceiver/framereceivermain.js
     * Lorsqu'une nouvelle trame est disponible, il faut:
     * a) L'inscrire dans la BD de stockage
     * b) L'envoyée au service node du queue manager
     */

    /**
     * Doc Listener
     * Réception par UDP des trames
     */
    udpserver.on('listening', function () {
        console.log('server listening on UDP port 3001');
    });

    udpserver.bind(PORT, HOST);//détermination du port du listener UDP

    var connection = ioClient.connect('http://' + server.host + ':' + server.serviceport);//Connexion pour emettre des
                                                                //messages http au serveur nodeService du queue manager

    /**
     * Doc listener message UDP
     * Lorsqu'on recoit un message UDP, nous allons filtrer les
     * trames à l'aide d'un filtre défini dans le fichier format.js
     * Celui ci retourne soit l'objet parser si la trame est valide
     * soit la valeur booléenne false.
     *
     * Si le filtre passe, nous allons écrire cette trame dans la base de donnée à l'aide de dbWriter,
     * on y passe la trame non parser ainsi que son 'TimeOfFix' (voir documentation trame)// TODO : documentation trame
     *
     * Si le filtre passe, nous allons envoyer la trame au prochain service TODO : service d'analyse spatiale
     */
    udpserver.on('message', function (data, remote) {
        format.filterUdp(data,function(frame){
            if(frame) { //Si la trame passe le filtre, elle en renvoyé, si non, la valeur false est retournée
                dbWriter.addData(db, frame.UpdateTime, data, function () {
                    console.log(frame);
                });

                //TODO : Ici, au lieu de renvoyer le DATA, nous allons envoyer la trame en format Frame deja parser
                //  pour l'analyse spatiale à un service intermédiaire
                connection.emit('bundledFrame', {date: frame.UpdateTime, data: data}, function (err) {
                    if (err)throw err;
                    console.log('data emitted');
                });

            }
        });
    });
});
