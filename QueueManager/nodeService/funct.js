/**
 * Created by deasel on 2016-03-03.
 */
/* Declarations and imports*/{
    var MongoClient = require('mongodb').MongoClient;
    var dbserver = require('./dbStorage.js');
    var assert = require('assert');
    var ioClient = require('socket.io-Client');
    var server = require('./server.js');
    var connection = ioClient.connect('http://'+server.host+':'+server.pubsubport);
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
    getFromTime : function(dateISO, callback){
        MongoClient.connect(dbserver.url, function(err,db){
            var cursor = db.collection('frame').find({"date":{ $gt: dateISO }},{"date":1,"frame":1,"id":0});
            cursor.forEach(function(err,doc){
                assert.equal(err,null);
                if(doc!= null){
                    console.log(doc);
                    connection.emit('newFrame',{channel: data.channel, frame: doc});
                } else {
                    callback();
                }
            });

            db.close();
            callback(cursor);
        })
    }
};