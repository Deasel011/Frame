/**
 * Created by deasel on 2016-03-02.
 */
/* Declarations and imports*/{
var server = require('./server.js');//module qui contient les information du serveur http de pubsub
var ioClient = require('socket.io-client');//module pour envoyer des messages par socket
}

module.exports = {
    /**
     * Doc error function.
     * Ad libram mamam.
     */
    error: function() {

    },
    /**
     * Doc getFromTime function.
     * envoie une requete a node api pour obtenir de la DB storage les trames.
     * @param time = le temps de la premiere trame qu'on veut recouvrir
     * @param channel = le canal sur lequel on veut diffuser les trames
     */
    getFromTime: function(time, channel){
        console.log(time);
        var connection = ioClient.connect('http://'+server.host+':'+server.apiport);
        connection.emit('getFromTime',{channel: channel,time: time}, function(err){
            if(err) throw err;
            connection.close();
            console.log('data emitted');
        });
    },
    /**
     * Doc publish funtion.
     * envoie dans un canal une trame avec l'évenement 'publishedFrame'
     * @param channel = le canal de diffusion
     * @param message = la trame à diffuser
     */
    publish: function(channel,message){
        channel.publish('publishedFrame',message);
    }

};
