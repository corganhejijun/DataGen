var express = require('express');
var router = express.Router();
var data = require('./data');
const path = require('path');
var fs = require('fs');
var configFile = path.resolve(__dirname, "./config.json");

function getConfigFile(){
  var fileStat = fs.statSync(configFile);
  var fileTime = fileStat.mtime;
  if (global.config.time < fileTime){
    global.config.data = JSON.parse(fs.readFileSync(configFile));
    global.config.time = fileTime;
    console.log("read file " + configFile + " ok");
  }
  return global.config.data;
}

function getData(parent, name){
  var d = new Date();
  var result = {time: d.getTime()};
  var config = getConfigFile();
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

function getTree(parent){
  var config = getConfigFile();
  return config[parent].tree;
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
    case 'tree':
      result.result = true;
      result.data = getTree(data.parent);
      res.json(result);
      break;
    case 'getdata':
      result.result = true;
      result.data = getConfigFile();
      res.json(result);
      break;
    default:
      res.json(result);
      break;
  }
});

module.exports = router;
