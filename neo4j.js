const fs = require('fs');
const _ = require('lodash');
const neo4j = require('neo4j-driver').v1;
// Initialize connection to Neo4J Driver
const driver = neo4j.driver('bolt://localhost', neo4j.auth.basic('neo4j', '1234'));

const session = driver.session();

let TOTAL_NODES = 0;

// Initialization, run once on startup.
const init = () => {
  const countNodesQuery = 'MATCH (n:Page) RETURN count(*)';
  let nodesCount = 0;
  session
  .run(countNodesQuery)
  .then((result) => {
    nodesCount = result.records[0].get(0);
    TOTAL_NODES = parseInt(nodesCount, 10);
  });
  return null;
};

// returns random node object
// test node id and title are not empty
// test result from neo isnt empty
const getRandomSite = () =>
    new Promise((resolve, reject) => {
      const getRandomNodeQuery =
      `MATCH (n:Page) RETURN n.title AS title
      SKIP {offset} LIMIT {limit}`
      const params = {
        offset: Math.floor(Math.random() * (TOTAL_NODES + 1)),
        limit: 1,
      };
      const node = {}
      session
    .run(getRandomNodeQuery, params)
    .then((result) => {
      node.title = result.records[0].get('title')
      console.log('node:', node);
      resolve(node)
    })
    .catch((err) => {
      reject(err)
    });
    });

const findShortestPathLength = function (origin, target, callback) {
  const query = 'MATCH (origin:Page {title:{originTitle}}),(target:Page{title:{targetTitle}}),'
  + ' path=shortestpath((origin)-[:LINK*]->(target)) RETURN length(path) as length';
  const params = {
    originTitle: origin,
    targetTitle: target,
  };
  let pathSize = -1;

  session
  .run(query, params)
  .then((result) => {
    // console.log(JSON.stringify(result))
    pathSize = result.records[0].get('length').toNumber();
    // console.log(pathSize, "in")
    callback(pathSize);
    session.close();
  });
};


module.exports = {
  init,
  get: getRandomSite,
};









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



// init();

