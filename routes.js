const express = require('express');
const db = require('./neo4j');
const path = require('path');
// var async = require('async');
// const util = require('util');

db.init();
const router = express.Router(); // eslint-disable-line

router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

router.get('/random', (req, res) => {
  Promise.all([db.get(), db.get()])
  .then(([originNode, targetNode]) => {
    res.redirect(`/${originNode.title}/to/${targetNode.title}`);
  }).catch(err => {
    console.error(err);
  });
});

router.get('/:origin/to/:target', (req, res) => {
  res.send(
  { origin: req.params.origin, target: req.params.target })
})
module.exports = router;
