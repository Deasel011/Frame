/**
 * Created by deasel on 2016-03-03.
 */

/* Declarations and imports*/{
    var assert = require('assert');
    var exports = module.exports ={};
    var dbUrl = require('../server.js').dburl;
    var dbtype = require('../server.js').dbtype;
    var mongoWriter = require('./mongoWriter.js');
    var bunyan = require('bunyan');
    var log = bunyan.createLogger({
        name: 'dbWriter',
        streams: [
            {
                level: 'info',
                stream: process.stdout
            }, {
                level: 'error',
                path: 'error.log'
            }, {
                level: 'fatal',
                path: 'fatalErrors.log'
            }
        ]
    });
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

exports.connect = function(callback){
    switch(dbtype){
        case 'mongo': mongoWriter.connect(dbUrl,function(err,db){
            callback(err,db);
        });
            break;
        default: callback('dbType unrecognized', null);
            break;
    }

}