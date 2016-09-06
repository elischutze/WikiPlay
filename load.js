const fs = require('fs');
const _ = require('lodash');
const neo4j = require('neo4j-driver').v1;
// Initialize connection to Neo4J Driver
const driver = neo4j.driver('bolt://localhost', neo4j.auth.basic('neo4j', '1234'));

const session = driver.session();


const loadCSV = (query) => {
  session
  .run(query)
  .then((result) => {
    console.log('Result:', JSON.stringify(result.summary));
    // session.close;
    // driver.close;
  });
}
const load = function (csvFilename) {
  const fileArr = fs.readdirSync(csvFilename);
  const filteredFiles = _.filter(fileArr, (filename) =>
   (filename.length === 7 && filename[1] === 'e')
  );
  // console.log(filteredFiles);
  _.forEach(filteredFiles, (file) => {
    const loadQuery = `USING PERIODIC COMMIT 1000 LOAD CSV from "file:///${file}" AS line WITH toint(line[0]) as from_id, line[2] as to_title MATCH (from:Page) WHERE from.id = from_id MATCH (to:Page) WHERE to.title = to_title MERGE (from)-[l:LINK]->(to)`;
    loadCSV(loadQuery);
  });
};
