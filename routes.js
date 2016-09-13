const express = require('express')
const db = require('./neo4j')
const path = require('path')
// var async = require('async')
// const util = require('util')

// db.init()
const router = express.Router() // eslint-disable-line

router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'))
})

// router.get('/rooms', (req, res) => {
//   res.sendFile(path.join(__dirname, '/public/play.html'))
// })
//
// router.get('/solo', (req, res) => {
//   res.sendFile(path.join(__dirname, '/public/solo.html'))
// })

router.get('/random', (req, res) => {
  db.get()
  .then(articles => {
    db.pathExists(articles).then(node => {
      res.send({ origin: node.origin, target: node.target, path: node.length })
    })
    .catch(() => res.redirect('/random'))
    console.log('articles', articles)
  })
  .catch(err => {
    console.error(err)
    res.redirect('/random')
  })
})

// router.get('/:origin/to/:targets', (req, res) => {
//   db.pathExists(req.params.origin, req.params.targets, (result, path) => {
//     if (result) {
//       res.send({ origin: req.params.origin, target: req.params.targets, path })
//     } else {
//       res.redirect('/random')
//     }
//   })
// })
module.exports = router
