/**
 * Created by deasel on 2016-03-03.
 *
 * Ce module recoit les trames GPS et en gère le format.
 * Il transforme la trame en format data facilement exportable
 */
var Parser = require('binary-parser').Parser;
var type83 = require('./frameType/type83parser.js');

var exports = module.exports = {};

/**
 * Prend en paramêtre un BUFFER contenant la trame sans le header UDP
 * Retourne dans un callback le résultat du buffer passer en requete
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
            type83.filterUdp(frame, function () {
                if (arguments[0]) {
                    callback(arguments[0]);
                } else {
                    callback(false);
                }
            });
            break;
        case 281://119 TODO implémenté avec la logique
            type281.filterUdp(frame, function () {
                if (arguments[0]) {
                    callback(arguments[0]);
                } else {
                    callback(false);
                }
            });
            break;
        case 288://120 TODO implémenté avec la logique
            type288.filterUdp(frame, function () {
                if (arguments[0]) {
                    callback(arguments[0]);
                } else {
                    callback(false);
                }
            });
            break;
        default:
            console.log("Trame de type inconnu.");
            break;
    }
};
