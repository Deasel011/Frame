/**
 * Created by deasel on 2016-03-03.
 */
var ioClient = require("socket.io-client");
var server = require('../server.js');
var isConnected = false;
module.exports = {
    send: function(data){
        var connection;
        if(!isConnected){
            connection = ioClient.connect('http://'+server.host+':'+server.serviceport);
            isConnected = true;
        }
        connection.emit('bundledFrame',data);
    }
}