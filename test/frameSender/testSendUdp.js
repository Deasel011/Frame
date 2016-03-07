/**
 * Created by deasel on 2016-03-03.
 */

var PORT = 3001,
    HOST = '127.0.0.1',
    dgram = require('dgram'),
    client=dgram.createSocket('udp4');

function justRunIt(i){
    if(i%5===0&&i!==10000){console.log(i)}

    if(i<50){
        var message=randomBuffer();
        client.send(message,0,message.length,PORT,HOST,function(err,bytes){
            if(err)throw err;

            message=randomBuffer();
            setTimeout(function(){justRunIt(i+1)},2000);
        });
    }
}

justRunIt(0);

function randomBuffer(){
    var buffer=new Buffer('8305466130557401010004000856B8AE9400000000000000000000000000000000000000000000000C02D0FFAD4F001F080001000C010A3030393630303036040D4F3D3E2B','hex');
    var isodate=(Math.floor(new Date().getTime()/1000));
    var time=isodate.toString(16);
    console.log(time);
        //console.log(buffer[17]+buffer[18]+' : '+time[i]+time[i+1]);
        var concat=new Buffer(time[0]+time[1]+time[2]+time[3]+time[4]+time[5]+time[6]+time[7], 'hex');
    console.log(concat);
        buffer[17]=concat[0];
        buffer[18]=concat[1];
        buffer[19]=concat[2];
        buffer[20]=concat[3];


    console.log(buffer);
    return buffer;
}