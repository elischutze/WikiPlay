var express = require('express');
var async = require('async');
var db = require('./neo4j.js');
var util = require('util');

var router = express.Router();

router.get('/',function(req,res){
    db.init();
    res.send("App is up and running!");
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
    res.send(util.format("A: %s \n\n B: %s",nodeA.title,nodeB.title));
});
   });


module.exports = router;