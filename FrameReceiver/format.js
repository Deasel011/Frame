/**
 * Created by deasel on 2016-03-03.
 *
 * Ce module recoit les trames GPS et en gère le format.
 * Il transforme la trame en format data facilement exportable
 */
var Parser = require('binary-parser').Parser;

var exports=module.exports = {};

/**
 * Prend en paramêtre un BUFFER contenant la trame sans le header UDP
 * Retourne dans un callback le résultat du buffer passer en requete
 */
exports.parseFrame = function(request,callback){

    callback(frameHeader.parse(request));
};

/**
 * parseFrame interne
 */
function parseFrame(request,callback){

    callback(frameHeader.parse(request));
}

/**
 * Doc Filtration des trames
 * Afin d'enlever les trames incompletes ou erronées
 * arguments[0] est l'objet passer dans le callback
 * de la fonction parseFrame(req,cb)
 * 131, 281 et 288 est l'équivalent en decimal de 83, 119 et 120 en hexa
 * et ce sont les trames que l'on veut conserver (a confirmer)
 */
exports.filterUdp = function(frame,callback){
    parseFrame(frame,function(){
        if((arguments[0].OptionsByte===131 //TODO : valider les types de trames a conserver avec Martin Roy
            ||arguments[0]===281
            ||arguments[0]===288)
                //&&arguments[0].Speed!==0
                //&&arguments[0].Heading!==0
                ){callback(arguments[0]);}
        else
            callback(false);
    })
};

var frameHeader = new Parser()
    .uint8('OptionsByte')
    .uint8('MobileIDLength')
    .array('MobileID',{type:'uint8',length:'MobileIDLength'})
    .uint8('MobileIDLen')
    .bit8('MobileIDType')
    .uint8('Service_Type')
    .uint8('Message_Type')
    .uint16('Sequence_Nu')
    .uint32('UpdateTime')
    .uint32('TimeOfFix')
    .floatbe('Latitude')
    .floatbe('Longitude')
    .floatbe('Altitude')
    .int32('Speed')
    .int16('Heading')
    .uint8('Satellites')
    .uint8('FixStatus')
    .uint16('Carrier')
    .uint16('RSSI')
    .uint8('CommState')
    .uint8('HDOP')
    .uint8('Inputs')
    .uint8('UnitStatus')
    .uint8('User_Msg_Route')
    .uint8('User_Msg_ID')
    .uint16('User_Msg_Length')
    .array('User_Msg',{type:'uint8',length:'User_Msg_Length'});
