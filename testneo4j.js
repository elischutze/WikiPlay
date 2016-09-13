const neo4j = require('neo4j-driver').v1
// Initialize connection to Neo4J Driver
const driver = neo4j.driver('bolt://localhost', neo4j.auth.basic('neo4j', '1234'))
const session = driver.session()




const getPaths = (titles) =>
    new Promise((resolve, reject) => {
      const query =
      `MATCH (origin:Page),(target:Page),path=shortestpath((origin)-[:LINK*]->(target))
      WHERE origin.title IN {titles} and target.title IN {titles}
      RETURN origin.title as origin,target.title as target,path, length(path) as length ORDER BY rand() LIMIT 3`
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
        const getRandomNodeQuery =
        `MATCH (origin:Page)
        WITH * ORDER BY rand() LIMIT 10
        RETURN origin.title as title`
        const titlelist = []
        session
      .run(getRandomNodeQuery).subscribe({
        onNext: (record) => {
          titlelist.push(record.get('title'))
        },
        onCompleted: () => {
          if (titlelist.length === 10) {
            console.log('got titles:',titlelist);
            resolve(titlelist)
          }
        },
        onError: (error) => reject(error)
      })
      })

get10RandomSitesNew()
  .then((titles) => {
    getPaths(titles).then((results) => {
      console.log('got results')
    })
  }).catch(err => console.log(err))

const get = () =>
    new Promise((resolve, reject) => {
      const getRandomNodeQuery =
      `MATCH (n:Page) RETURN n.title AS title
      SKIP {offset} LIMIT {limit}`
      const params = {
        offset: Math.floor(Math.random() * (6000000 + 1)),
        limit: 1
      }
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
    })
    })

const getRandomSiteNew = () =>
  new Promise((resolve, reject) => {
    const getRandomNodeQuery =
    `MATCH (origin:Page)
    WITH * ORDER BY rand() LIMIT 2
    RETURN origin.title as title`
    const node = {}
    session
  .run(getRandomNodeQuery)
  .then((result) => {
    node.origin = result.records[0].get('title')
    node.target = result.records[1].get('title')
    // console.log('node:', node);
    var nu = 'new'
    resolve({node, nu})
  })
  .catch((err) => {
    reject(err)
  })
})

const getRandomSiteOld = () =>
    new Promise((resolve, reject) => {
      Promise.all([get(), get()])
      .then(([origin, target]) => {
        var old = '"old"'
        resolve({origin, target, old})
      }).catch(err => {
        console.error(err)
      })
    })

// console.log('Race time')
// Promise.race([getRandomSiteNew(), getRandomSiteOld()]).then(value => {
//   console.log(value)
// }).catch(err => {
//   console.error(err)
// })
