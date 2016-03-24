/**
 * Created by deasel on 2016-03-03.
 */

/* Declarations and imports*/{
    var MongoClient = require('mongodb').MongoClient;
    var assert = require('assert');
    var exports = module.exports ={};
}

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
    if(db) {
        db.collection('frame').insert({

            date: date,
            frame: data.toString('hex')
        }, function (err, result) {
            if (err === null) {
                callback(null, "Insert Successfull!");// le premier argument du callback est err, le deuxieme est une variable X (ici le résultat! en string!)
            } else {
                callback(err, null)
            }
        });
    }
};

exports.connect = function(url, callback){
        MongoClient.connect(url, {
            retryMiliSeconds: 5000,
            numberOfRetries: 200
        }, function (err, db) {
            database = db;
            callback(err, db);
        })
};