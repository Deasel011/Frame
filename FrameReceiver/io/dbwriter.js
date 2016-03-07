/**
 * Created by deasel on 2016-03-03.
 */

/* Declarations and imports*/{
    var MongoClient = require('mongodb').MongoClient;
    var assert = require('assert');
}


var options = {
    port: 12345,
    host: 'localhost'
};

module.exports = {
    write : function(date, data){
        addData('mongodb://localhost:12345/frame','frame',date,data,function(){console.log(arguments[0])});
    },
    connect : function(callback){
        MongoClient.connect('mongodb://'+options.host+':'+options.port+'/',function(err,db){
            assert.equal(err,null);
            callback(db);
        });
    },
    disconnect: function(db){
        db.close();
    }
};

function connectAddData(url,collection,date,data,callback){
    MongoClient.connect(url,function(err,db){
                db.collection(collection).insert({
                        date:date,
                        data: data
                    },function(err, result){
                        db.close();
                        if(err === null) { callback("Insert Successfull!")}
                        else {callback("Insert Failed :(")}
                    }
                );
    })
}

function addData(db,collection,date,data,callback){
    db.collection(collection).insert({
        date: date,
        data: data
    }, function(err, result){
        if(err === null){
            callback("Insert Successfull!")
        } else {
            callback("Insert Failed :(")
        }
    });
}