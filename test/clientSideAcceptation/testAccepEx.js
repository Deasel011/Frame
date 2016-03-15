/**
 * Created by deasel on 2016-03-15.
 */
/**
 * Created by deasel on 2016-03-03.
 */
var amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', function(err,conn){
    conn.createChannel(function(err,ch){
        var ex = 'frame';

        ch.assertExchange(ex,'fanout',{durable:true,persistent:true});

        ch.assertQueue('accep',{persistent:true,durable:true},function(err,q){
            ch.bindQueue(q.queue,ex,'accep');

            ch.consume(q.queue, function(data){
                console.log(data+'\n'+'Successfully received.')
            },{noAck:false});
        });

    })
});