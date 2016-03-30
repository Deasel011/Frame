/**
 * Created by deasel on 2016-03-03.
 */
/* Declarations and imports*/{
    var MongoClient = require('mongodb').MongoClient;
    var dbserver = require('./dbStorage.js');
    var assert = require('assert');
    //var ioClient = require('socket.io-client');
    var server = require('./server.js');
    //var connection = ioClient.connect('http://'+server.host+':'+server.pubsubport);
}

module.exports = {
    /**
     * Doc getFromTime function
     * Dans le module de fonction du service Node de Pub/sub, la fonction
     * getFromTime prend en paramêtre une date en format ISO puis fait une
     * requête sur la base de donnée de stockage des trames à long terme.
     * Elle retourne le curseur en callback.
     * @param dateISO
     * @param callback
     */
    getFromTime : function(dateISO,connection,channel){
        MongoClient.connect(dbserver.url, function(err,db){
            db.collection('frame').find({date: {$gt: parseInt(dateISO)}}).each(function(err,doc){
                if(doc!==null) {
                    console.log(doc);
                    connection.emit('newFrame', JSON.stringify({channel: channel, date: doc.date, frame: doc.frame}));
                }
            })
        });




        /*
        MongoClient.connect(dbserver.url, function(err,db){
            db.collection('frame').find({date:{ $gt: dateISO }},{"date":1,"frame":1,"id":0}).each(function(err,doc){
                if(err) console.error(err);
                console.log(doc);
                if(doc!=null){
                    connection.emit('newFrame',{channel: data.channel, frame: doc});
                } else { callback();
                }
            });
        })*/
    }
};
