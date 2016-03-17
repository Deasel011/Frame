/**
 * Created by deasel on 2016-03-03.
 */

/* Declarations and imports*/{
    var assert = require('assert');
    var exports = module.exports ={};
    var dbUrl = require('../server.js').dburl;
    var dbtype = require('../server.js').dbtype;
    var mongoWriter = require('./mongoWriter.js');
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
    switch(dbtype){
        case 'mongo':
            callback(mongoWriter.addData(db,date,data,callback));
            break;
        default: callback('dbType unrecognized', null);
            break;
    }
};

exports.connect = function(callback){
    switch(dbtype){
        case 'mongo':
            callback(mongoWriter.connect(dbUrl,callback));
            break;
        default: callback('dbType unrecognized', null);
            break;
    }
};