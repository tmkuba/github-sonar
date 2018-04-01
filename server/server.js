const dotenv = require('dotenv');
// const path = require('path');
const winston = require('winston');
const express = require('express');
const morgan = require('morgan');
const db = require('./db');

dotenv.config();

const app = express();
app.use(morgan('dev'));

app.get('/locations/:needle', (req, res) => {
  winston.log('debug', `Searching for ${req.params.needle}`);
  db.findLocation(req.params.needle)
    .then((results) => {
      winston.log('debug', `${results.length} records found`);
      res.send(results);
    })
    .catch((error) => {
      winston.log('error', `Error ${error.message}`);
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  winston.log('debug', `Listening on port ${PORT}`);
});
