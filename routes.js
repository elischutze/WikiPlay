var express = require('express');
var async = require('async');
var db = require('./neo4j.js');
db.init();
var util = require('util');

var router = express.Router();

router.get('/',function(req,res){

    res.sendFile(__dirname + "/public/index.html");
});

router.get('/random',function(req,res){

    async.parallel([
    function(callback){
        db.get(function(node,err){
        callback(err,node);
        });

    },
    function(callback){
        db.get(function(node,err){
        callback(err,node);
        });
    }
    ], function(err, results) {
    // results: Node1, Node2
    console.log(results);
    nodeA=results[0];
    nodeB=results[1];
    res.send({origin:nodeA.title,target:nodeB.title});
});
   });




module.exports = router;