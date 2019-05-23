/*eslint-disable unknown-require, unknown-require, no-unused-params, no-undef, no-use-before-define, eqeqeq*/
var express = require('express');

var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json());

var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;

var mongoUrl = 'mongodb://localhost:27017/lab2db';
var mongo;
MongoClient
  .connect(mongoUrl)
  .then(function(db) {
    mongo = db;
    mongo.createCollection("tasks", function(err, res) {
     if (err) throw err;
        console.log("Collection created!");
        //db.close();
    });
  });

app.use('/', express.static(__dirname + '/static'));

var idN = -1;
var delID;

app.get('/tasks', function(req, res) {
  mongo
  .collection('tasks').find().toArray()
  .then(function(tasks) {
    res.send(tasks);
  }); 
});

app.post('/tasks', function (req, res) {
    idN += 1;
    mongo
    .collection('tasks').insert({id: idN, name: req.body.name })
    .then(function() {
        res.send({id: idN, name: req.body.name });
    });    
});

app.delete('/tasks/:id', function(req, res) {
    var ID = req.params.id;
    getById(ID);
    mongo
    .collection('tasks').find().toArray()
    .then(function(tasks) {
        mongo
        .collection('tasks').removeOne(tasks[delID])
        .then(function() {
        res.send(ID);
        });
    });   
});

var getById = function(idP){
    mongo
    .collection('tasks').find().toArray()
    .then(function(tasks) {
        for(var i = 0; i < tasks.length; i++){
             if(tasks[i].id == idP){
                 delID = i;
             }    
        }  
  });
};


app.listen(3000);