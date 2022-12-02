let express = require('express');
// var compression = require('compression');
var app = express();
const bodyParser = require('body-parser');
// var engine = require('consolidate');
// var fs = require('fs');
var https = require('http'); 
// const routes = require('./routes.js');

app.use("/node_modules", express.static(__dirname + '/node_modules'));
app.use("/bower_components", express.static(__dirname + '/bower_components'));

app.get("/", (req, res) => res.sendFile(__dirname + '/src/index2.html'));
app.use("/", express.static(__dirname + '/src'));


app.set("port", 8080);
// app.engine('html', engine.mustache);
// app.set('view engine', 'html');

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb', parameterLimit: 50000 }));


app.use(function (req, res, next) {
  console.log("/*********************again/", req.method, req.url, req.origin);

  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, content-type, Accept, Authorization");
  next();
});

var server = https.createServer(app);

server.listen(process.env.PORT || app.get("port"), function () {
  console.log('Euromill is running', process.env.PORT || app.get("port"));
});
