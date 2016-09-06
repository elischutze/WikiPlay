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
  .then(([origin, target]) => {
    console.log('origin:', origin, 'target:', target);
    res.redirect(`/${origin.title}/to/${target.title}`);
  }).catch(err => {
    console.error(err);
  });
});

router.get('/:origin/to/:targets', (req, res) => {
  db.pathExists(req.params.origin, req.params.targets, (result) => {
    if (result) {
      res.send({ origin: req.params.origin, target: req.params.targets })
    } else {
      res.redirect('/random')
    }
  })
})
module.exports = router;
