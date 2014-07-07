var async = require("async");
var mongoose = require('mongoose');

var urlstring1 = "mongodb://localhost/Source";
var urlstring2 = "mongodb://localhost/Destination";

var sourceConnection = mongoose.createConnection(urlstring1);
var DestinationConnection = mongoose.createConnection(urlstring2);

var userDatabaseSchema = {
    name: String,
    age: Number
};

var userData = [
    {
        name: "sandeep kumar",
        age: 25
    },
    {
        name: "Rakesh kumar",
        age: 26
    },
    {
        name: "Mohit kumar",
        age: 28
    },
    {
        name: "Rubi",
        age: 26
    },
    {
        name: "Vinita sharma",
        age: 25
    },
    {
        name: "Kashish Gupta",
        age: 26
    },
    {
        name: "manoj kumar",
        age: 25
    },
    {
        name: "rohit kumar",
        age: 28
    },
    {
        name: "sandeep singh",
        age: 29
    },
    {
        name: "Rajesh kumar",
        age: 30
    }
];

var sourceSchema = new mongoose.Schema(userDatabaseSchema);
var sourceModel = sourceConnection.model("Users", sourceSchema);
var destinationModel = DestinationConnection.model("Person", sourceSchema);


function cleanUserData(callback){
    sourceModel.find({}).remove().exec(function (err, result) {
        console.log("Clean User Data: " + result);
        callback();
    });
}

function saveUserData(callback) {
    userData.forEach(function (data) {
        var task = [];
        task.push(function (callback) {
            new sourceModel(data).save(function (err) {
                if (err) {
                    console.log(err);
                    callback(err);
                    return;
                }
                console.log(data);
                callback();
            })
        });
        async.series(task, function (err,result) {
            if (err)
                console.log("Error: " + err);
            else
                callback();
        });
    });
}

function showUserData(callback) {
    sourceModel.find({}).exec(function (err, result) {
        console.log("User Data: " + result);
        callback();
    });
}

function saveToPerson() {
    sourceModel.find({}).exec(function (err, result, callback) {
        var task = [];
        result.forEach(function (data) {
            task.push(function (callback) {
                new destinationModel(data).save(function (err) {
                    if (err) {
                        callback(err);
                        return;
                    }
                    callback();
                })
            });
        });
        async.series(task, function (err) {
            if (err)
                console.log("Error: " + err);
        });
    });
}

function showPersonData(callback) {
    destinationModel.find({}).exec(function (err, result) {
        console.log("Person Data: " + result);
        callback();
    });
}

async.series([cleanUserData,saveUserData,showUserData,saveToPerson,showPersonData],function(err){
    if (err)
        console.log("Error: " + err);
});




