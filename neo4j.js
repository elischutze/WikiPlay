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
      // console.log('node:', node);
      resolve(node)
    })
    .catch((err) => {
      reject(err)
    });
    });

const findShortestPathLength = function (origin, target, cb) {
  console.log('called with',origin,'and',target);
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
    console.log('...in then')
    console.log(result);
    // console.log(JSON.stringify(result))
    pathSize = result.records[0].get('length').toNumber();
    console.log('pathSize:', pathSize);
    if (pathSize > 0) {
      cb(true)
    } else if (pathSize === 0) {
      cb(false)
    }
    throw new Error('No pathSize assigned');

    // console.log(pathSize, "in")
    // callback(pathSize);
    // session.close();
  }).catch(err => {
    console.log(err);
  });
};

module.exports = {
  init,
  get: getRandomSite,
  pathExists: findShortestPathLength,
};
