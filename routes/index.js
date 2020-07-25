var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'home' });
});
router.get('/todo', function(req, res, next) {
  res.render('todolist', { title: 'todolist' });
});
module.exports = router;
