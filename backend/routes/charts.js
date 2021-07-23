var express = require('express');
const data = require('../charts/index');
var router = express.Router();

/* GET charts listing. */
router.get('/', function(req, res, next) {
  // console.log('\nobj:', JSON.stringify(data, null, 2));
  res.send(data);
});


module.exports = router;
