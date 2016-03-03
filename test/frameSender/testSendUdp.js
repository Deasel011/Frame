/**
 * Created by deasel on 2016-03-03.
 */

var PORT = 3001,
    HOST = '127.0.0.1',
    dgram = require('dgram'),
    client=dgram.createSocket('udp4');

function justRunIt(i){
    if(i%5===0&&i!==10000){console.log(i)}

    if(i<10000){
        var message=randomString(104);
        client.send(message,0,message.length,PORT,HOST,function(err,bytes){
            if(err)throw err;

            message=randomString(104);
            setTimeout(function(){justRunIt(i+1)},0001);
        });
    }
}

justRunIt(0);

function randomString(size){
    var string='';
    for(var i=0;i<size;i++){
        string+=Math.floor(Math.random()*(2));
    }
    return string;
}