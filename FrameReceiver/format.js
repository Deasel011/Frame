/**
 * Created by deasel on 2016-03-03.
 *
 * Ce module recoit les trames GPS et en gère le format.
 * Il transforme la trame en format data facilement exportable
 */
var type83 = require('./frameType/type83parser.js');

var exports = module.exports = {};

/**
 * Prend en paramêtre un BUFFER contenant la trame sans le header UDP
 * Retourne dans un callback le résultat du buffer passer en requete
 * TODO finir cette fonction comme celle de filtration au cas ou nous en aurions de besoin par apres... meme s'il n'est pas optimal de faire passer 2 fois le parser pour la meme trame dans le temps, il y a surement une meilleure solution!
 */
exports.parseFrame = function (request, callback) {

    callback(frameHeader.parse(request));
};

/**
 * Doc Filtration des trames
 * Afin d'enlever les trames incompletes ou erronées
 * arguments[0] est l'objet passer dans le callback
 * de la fonction parseFrame(req,cb)
 * 131, 281 et 288 est l'équivalent en decimal de 83, 119 et 120 en hexa
 * et ce sont les trames que l'on veut conserver (a confirmer)
 */
exports.filterUdp = function (frame, callback) {
    console.log(frame[0]);
    switch (frame[0]) {
        case 131://83
            callback(type83.filterUdp(frame,callback));
            break;
        case 281://119 TODO implémenté avec la logique
            callback(type119.filterUdp(frame,callback));
            break;
        case 288://120 TODO implémenté avec la logique
            callback(type120.filterUdp(frame,callback));
            break;
        default:
            console.log("Trame de type inconnu.");
            break;
    }
};
