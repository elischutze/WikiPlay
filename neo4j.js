var fs = require('fs');
var _ = require('lodash');
var neo4j = require('neo4j-driver').v1;
var driver = neo4j.driver("bolt://localhost", neo4j.auth.basic("neo4j", "1234"));
var session = driver.session();

// session
//     .run("MATCH (page:Page)-[:LINK]->(other:Page) RETURN page.title as a, other.title as b LIMIT 100")
//     .then( function(result){
//         for(var i = 0;i<result.records.length;i++){
//             console.log(i);
//             console.log(result.records[i].get("a")+" links to "+result.records[i].get("b"));
//         }
//         // console.log("Result:", JSON.stringify(result));
//         session.close;
//         driver.close;
//     });
function load(){
    var fileArr =  fs.readdirSync("../../../Documents/Neo4j/wikiplay.graphdb/import");
    var filteredFiles = _.filter(fileArr,function(filename){
        return (filename.length===7 && filename[1]==='b');
    });
    console.log(filteredFiles);
    _.forEach(filteredFiles.slice(0,4), function(file){

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

load();


