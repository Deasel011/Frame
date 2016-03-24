/**
 * Created by deasel on 2016-03-03.
 */
///TODO : gestion d'erreur sans crash!
/* Declarations and imports*/{
    var dbWriter = require('./dbwriter');//fonctions appellées dans les events de canaux
    var http = require('http');//module http
    var server = require('./server.js');//module qui contient les information du serveur http de pubsub
    var dbUrl = require('./server.js').dburl;
    var format = require('./frametype');//module qui contient les informations sur le format et qui permet de le parser
    var ioClient = require('socket.io-client');
    var bunyan = require('bunyan');
    var log = bunyan.createLogger({
        name: 'frameReceiver',
        streams: [
            {
                level: 'info',
                stream: process.stdout
            }, {
                level: 'error',
                path: '../error.log'
            }, {
                level: 'fatal',
                path: '../fatalErrors.log'
            }
        ]
    });
    var EventEmitter = require('events').EventEmitter;
    var emitter = new EventEmitter();
    var webServer = http.createServer(function (req, res) {
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end('FrameReceiver server running on port ' + server.port);
    }).listen(server.port);//création du serveur http
    var io = require('socket.io').listen(webServer);//module pour recevoir des messages par socket
    var isConnected=false;
    var PORT = require('./server').uPortListen;//numero du port pour le listener UDP!
}

/**
 * Doc Connection DbWriter
 * Afin de ne pas créer de traffic excessif, nous créons un pool afin de faire toutes
 * les requêtes d'écritures.
 * Il est possible de brancher la logique de connection/écriture sur une autre base
 * de donnée. Pour ce faire, ajouter dans le module IO du code javascript pour la
 * connecter a une autre BD puis ajouter l'information! Utiliser le canevas de base
 * MongoWriter comme exemple. TODO rajouter un modèle avec oracle
 */
function connectDb(dbUrl) {
    dbWriter.connect(function (err, db) {
        if (err) {
            log.error(err);
            setTimeout(function () {
                emitter.emit('retryConnection')
            }, 5000);
        } //Logging des erreurs de connection, si ne fonctionne pas, lance l'erreur en question. Lorsque l'erreur est lancée, on met isConnected a false
        else if (err === null) {
            emitter.addListener('dbAdd', function (frame, data) {
                    dbWriter.addData(db, frame.UpdateTime, data, function (err, result) {
                        if (err) {
                            log.error(err);
                            //if(err.message==="topology was destroyed"){db.close(); emitter.emit('retryConnection');}
                        }
                        if (result) {
                            log.info(result);
                        }
                    })
                }
            )
        }
    })
}
connectDb(dbUrl);//TODO Supporte que la BD ne soit pas up en même temps que le service, cependant, si la BD plante, la reconnection doit etre automatisée
emitter.addListener('retryConnection', function () {
    connectDb(dbUrl);
});
/* Déclarations pour réception UDP */{
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
 *  + Détermination du port du listener UDP
 */
{
    udpserver.on('listening', function () {
        console.log('server listening on '+udpserver.address().address+':'+udpserver.address().port);
    });

    udpserver.bind(PORT);//détermination du port du listener UDP
}

/**
 * Doc Connection
 * Connexion pour emettre des messages http au serveur nodeService du
 * queue manager
 */
var connection = ioClient.connect('http://' + server.host + ':' + server.serviceport, function (err) {
    if (err) log.error(err);
});

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
    console.log('Received some message via UDP');
    format.filterUdp(data, function (frame) {
        if (frame) { //Si la trame passe le filtre, elle en renvoyé, si non, la valeur false est retournée
            emitter.emit('dbAdd', frame, data);


            //TODO : Ici, au lieu de renvoyer le DATA, nous allons envoyer la trame en format Frame deja parser
            //  pour l'analyse spatiale à un service intermédiaire
            connection.emit('bundledFrame', {date: frame.UpdateTime, frame: data.toString('hex')}, function (err) {
                if (err) {
                    log.error(err)
                }
            });

        }
    });
});

