var fs = require('fs');
var _ = require('lodash');
var neo4j = require('neo4j-driver').v1;
var driver = neo4j.driver("bolt://localhost", neo4j.auth.basic("neo4j", "1234"));
var session = driver.session();

var TOTAL_NODES = 0;

function init(){

    //COUNT ALL NODES
    var countNodesQuery = "MATCH (n:Page) RETURN count(*)";
    var nodesCount = 0;
    session
    .run(countNodesQuery)
    .then( function(result){
        nodesCount = result.records[0].get(0);
        TOTAL_NODES = parseInt(nodesCount);
        console.log("Count:", TOTAL_NODES/1);
        // session.close;
        // driver.close;
        // getRandomSite();
    });
return null;

}

function load(){


    var fileArr =  fs.readdirSync("../../../Documents/Neo4j/wikiplay.graphdb/import");
    var filteredFiles = _.filter(fileArr,function(filename){
        return (filename.length===7 && filename[1]==='e');
    });
    console.log(filteredFiles);
    _.forEach(filteredFiles, function(file){

        var loadQuery = "USING PERIODIC COMMIT 1000 LOAD CSV from \"file:///"+file+"\" AS line WITH toint(line[0]) as from_id, line[2] as to_title MATCH (from:Page) WHERE from.id = from_id MATCH (to:Page) WHERE to.title = to_title MERGE (from)-[l:LINK]->(to)";
        loadCSV(loadQuery);
    });

}
function loadCSV(query){
    session
    .run(query)
    .then( function(result){
        console.log("Result:", JSON.stringify(result.summary));
        session.close;
        driver.close;
    });
}

//returns random node object

//test node id and title are not empty
//test result from neo isnt empty
function getRandomSite(callback){
    console.log("hurr");
    var error = "";
    var skipNum = Math.floor(Math.random() * (TOTAL_NODES+1));
    var getRandomNodeQuery = "MATCH (n:Page) RETURN n.title AS title SKIP {offset} LIMIT {limit} ";
    var params = {
        'offset': skipNum,
        'limit': 1
    };
    var node = {};
    session
    .run(getRandomNodeQuery,params)
    .then(function(result){
        node.title = result.records[0].get("title");
        console.log("node:", node);
        callback(node,error);
        session.close;
        driver.close;
    });


}

// init();

module.exports = {'init':init,'get':getRandomSite}


