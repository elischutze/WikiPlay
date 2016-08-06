var fs = require('fs');
var _ = require('lodash');
var neo4j = require('neo4j-driver').v1;
var driver = neo4j.driver("bolt://localhost", neo4j.auth.basic("neo4j", "1234"));
var session = driver.session();

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
function getRandomSite(){

}

