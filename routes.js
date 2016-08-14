var express = require('express');
var db = require('./neo4j.js');
var util = require('util')

var router = express.Router()

router.get('/',function(req,res){
    db.init();
    res.send("App is up and running!");
});




router.get('/random',function(req,res){
    nodeA = {};
    nodeB = {};
    db.get(function(node,err){
        nodeA = node;
        db.get(function(node2,err){
            nodeB = node2;
            res.send(util.format("A: %s \n B: %s",nodeA.title,nodeB.title));

        });

    });

});


module.exports = router;