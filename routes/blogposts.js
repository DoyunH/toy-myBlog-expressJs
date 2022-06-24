var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/blogposts', function(req, res, next) {
  res.json(blogposts)
});

router.put('/user', function(req, res) {
  res.send('Got a PUT request at /user');
});

router.delete('/user', function(req, res) {
  res.send('Got a DELETE request at /user');
});

module.exports = router;
