/**
 * Created by deasel on 2016-03-03.
 */

/* Declarations and imports*/{
    var MongoClient = require('mongodb').MongoClient;
    var assert = require('assert');
    var exports = module.exports ={};
}
var options = {
    port: 12345,
    host: 'localhost'
};


/**
 * Doc addData
 * La fonction a appeller pour insérer dans une base de donnée
 * a l'aide d'un index (à créer dans la BD) sur la date
 * @param db
 * @param date
 * @param data
 * @param callback
 */
exports.addData = function(db, date, data, callback) {
    //console.log(data);
    db.collection('frame').insert({
        date: date,
        frame: data
    }, function (err, result) {
        if (err === null) {
            callback("Insert Successfull!")
        } else {
            callback("Insert Failed :(")
        }
    });
};