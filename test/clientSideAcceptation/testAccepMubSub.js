/**
 * Created by deasel on 2016-03-03.
 */
var mubsub = require('mubsub');//Pub/Sub dependencies for mongodb by Scott Nelson!
var client = mubsub('mongodb://localhost:27017/pubsub');
var fs = require('fs');
var datefile = "lastDate.txt";

var channel = client.channel('accep');

channel.subscribe('publishedFrame',function(frame){
    fs.writeFile(datefile, frame.date, function(err){
        if (err) throw err;
        console.log(frame);
        console.log(frame.date+' successfully written.')
    });
});

readFile(function(){channel.publish('getFromTime',arguments[0])});

function readFile(callback) {
    fs.readFile(datefile,function(err,data){
        callback(data.toString());
    });
}