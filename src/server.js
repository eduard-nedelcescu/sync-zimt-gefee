const express = require('express');
const bodyParser = require('body-parser');

const server = express();

// CORS
server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Authorization, Content-Type, Accept',
  );
  next();
});

function init() {
  server.use(bodyParser.json());
  server.use(bodyParser.urlencoded({ extended: true }));

  // routes
  require('./routes/zimt')(server);
  require('./routes/gefee')(server);
}


init();

module.exports = server;
