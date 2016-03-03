/**
 * Created by deasel on 2016-03-03.
 */
var mubsub = require('mubsub');//Pub/Sub dependencies for mongodb by Scott Nelson!
var client = mubsub('mongodb://localhost:27017/pubsub');

var channel = client.channel('accep');

var cpt=0

channel.subscribe('publishedFrame',function(message){
    console.log(cpt++);
});