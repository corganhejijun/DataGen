var express = require('express');
var router = express.Router();
var data = require('./data');
var config = require('./config');

function getData(parent, name){
  var d = new Date();
  var result = {time: d.getTime()};
  for (var i = 0; i < name.length; i++){
    var variableName = name[i];
    for (item in config[parent]){
      if (item == variableName){
        var value = data.getRandom(config[parent][item].max, config[parent][item].min);
        result[item] = value;
        break;
      }
    }
  }
  return result;
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.post('/', function(req, res, next){
  var data = req.body;
  var result = {result: false};
  switch(data.method){
    case 'get':
      result.result = true;
      result.data = getData(data.parent, data.name);
      res.json(result);
      break;
    default:
      res.json(result);
      break;
  }
});

module.exports = router;
