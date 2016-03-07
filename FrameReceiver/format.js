/**
 * Created by deasel on 2016-03-03.
 *
 * Ce module recoit les trames GPS et en gère le format.
 * Il transforme la trame en format data facilement exportable
 */
var Parser = require('binary-parser').Parser;

var exports=module.exports = {}

/* Prend en paramêtre un BUFFER contenant la trame sans le header UDP
 *Retourne dans un callback le résultat du buffer passer en requete
 */
exports.parseFrame = function(request,callback){

    callback(frameHeader.parse(request));
}


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
    .int32('Latitude')
    .int32('Longitude')
    .int32('Altitude')
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
    .array('User_Msg',{type:'uint8',length:'User_Msg_Length'})


//**************************
var buf = new Buffer('8305466130557401010004000856B8AE9400000000000000000000000000000000000000000000000C02D0FFAD4F001F080001000C010A3030393630303036040D4F3D3E2B','hex')

console.log(frameHeader.parse(buf));
//**************************
//Pour tester si le frameHeader
//fonctionne, invoquer avec
