const neo4j = require('neo4j-driver').v1
// Initialize connection to Neo4J Driver
const driver = neo4j.driver('bolt://localhost', neo4j.auth.basic('neo4j', '1234'))
const session = driver.session()

const getPaths = () =>
    new Promise((resolve, reject) => {
      const query =
      `MATCH (n:Page)
        WITH * ORDER BY rand() LIMIT {l}
        WITH COLLECT(n.title) as alls
        MATCH path=shortestPath((pg:Page)-[:LINK*]->(opg:Page))
        WHERE pg.title IN alls and opg.title IN alls
        RETURN pg.title as origin, opg.title as target, path, length(path) as length LIMIT 3`
      const params = {
        l: 10
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
        resolve(node)
      } else {
        reject('no results')
      }
    })
    .catch((err) => {
      reject(err)
    })
    })

module.exports = {
  get: getPaths
}
