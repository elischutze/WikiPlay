// const fs = require('fs');
// const _ = require('lodash');
const neo4j = require('neo4j-driver').v1
// Initialize connection to Neo4J Driver
const driver = neo4j.driver('bolt://localhost', neo4j.auth.basic('neo4j', '1234'))

const session = driver.session()

const getPaths = (titles) =>
    new Promise((resolve, reject) => {
      const query =
      `MATCH (origin:Page),(target:Page),path=shortestpath((origin)-[:LINK*]->(target))
      WHERE origin.title IN {titles} and target.title IN {titles}
      RETURN origin.title as origin,target.title as target,path, length(path) as length ORDER BY rand() LIMIT 1`
      const params = {
        titles
      }
      let node = {}
      session
    .run(query, params)
    .then((result) => {
      // console.log(result.records)
      if (result.records.length > 0) {
        node.origin = result.records[0].get('origin')
        node.target = result.records[0].get('target')
        node.length = result.records[0].get('length').toNumber()
        // node.path = result.records[0].get('path')
        console.log(node)
        resolve(node)
      } else {
        reject()
      }
    })
    .catch((err) => {
      reject(err)
    })
    })

const get10RandomSitesNew = () =>
      new Promise((resolve, reject) => {
        const limit = 6
        const getRandomNodeQuery =
        `MATCH (origin:Page)
        WITH * ORDER BY rand() LIMIT {l}
        RETURN origin.title as title`
        const titlelist = []
        session
      .run(getRandomNodeQuery,{l:limit}).subscribe({
        onNext: (record) => {
          titlelist.push(record.get('title'))
        },
        onCompleted: () => {
          if (titlelist.length === limit) {
            console.log('got titles:',titlelist);
            resolve(titlelist)
          }
        },
        onError: (error) => reject(error)
      })
      })

//
//
// let TOTAL_NODES = 0
//
// // Initialization, run once on startup.
// const init = () => {
//   const countNodesQuery = 'MATCH (n:Page) RETURN count(*)'
//   let nodesCount = 0
//   session
//   .run(countNodesQuery)
//   .then((result) => {
//     nodesCount = result.records[0].get(0)
//     TOTAL_NODES = parseInt(nodesCount, 10)
//   })
//   return null
// }
//
// // returns random node object
// // test node id and title are not empty
// // test result from neo isnt empty
// const getRandomSite = () =>
//   new Promise((resolve, reject) => {
//     const getRandomNodeQuery =
//     `MATCH (origin:Page)
//     WITH * ORDER BY rand() LIMIT 2
//     RETURN origin.title as title`
//     const node = {}
//     session
//   .run(getRandomNodeQuery)
//   .then((result) => {
//     node.origin = result.records[0].get('title')
//     node.target = result.records[1].get('title')
//     resolve(node)
//   })
//   .catch((err) => {
//     reject(err)
//   })
//   })
//
// const findShortestPathLength = function (origin, target, cb) {
//   console.log('called with', origin, 'and', target)
//   const query = 'MATCH (origin:Page {title:{originTitle}}),(target:Page{title:{targetTitle}}),' +
//   ' path=shortestpath((origin)-[:LINK*]->(target)) RETURN length(path) as length'
//   const params = {
//     originTitle: origin,
//     targetTitle: target
//   }
//   let pathSize = -1
//   session
//   .run(query, params)
//   .then((result) => {
//     if (result.records.length === 0) {
//       cb(false, -1)
//     }
//     console.log('...in then')
//     console.log(result)
//     // console.log(JSON.stringify(result))
//     pathSize = result.records[0].get('length').toNumber()
//     console.log('pathSize:', pathSize)
//     if (pathSize > 0) {
//       cb(true, pathSize)
//     } else if (pathSize === 0) {
//       cb(false, -1)
//     }
//     throw new Error('No pathSize assigned')
//
//     // console.log(pathSize, "in")
//     // callback(pathSize);
//     // session.close();
//   }).catch(err => {
//     console.log(err)
//   })
// }

module.exports = {
  // init,
  get: get10RandomSitesNew,
  pathExists: getPaths
}
