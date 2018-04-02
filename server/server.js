const dotenv = require('dotenv');
const path = require('path');
const winston = require('winston');
const express = require('express');
const morgan = require('morgan');

// const webpack = require('webpack');
// const middleware = require('webpack-dev-middleware');
// const config = require('../webpack.config.js');
const db = require('./db');

dotenv.config();
// const compiler = webpack(config);

const app = express();
app.use(morgan('dev'));

// app.use(middleware(compiler));

app.get('/locations/:searchTerm', (req, res) => {
  const { searchTerm } = req.params;
  winston.log('debug', `Searching for ${searchTerm}`);

  const regex = new RegExp(searchTerm, 'i');

  db.findLocation(searchTerm)
    .then((results) => {
      winston.log('debug', `${results.length} records found`);

      const newResults = results.map((repo) => {
        const numDevs = repo.contributors.reduce((acc, user) => {
          const loc = user.location ? user.location : '';
          if (loc.match(regex) !== null) {
            acc += 1;
          }
          return acc;
        }, 0);
        const totDevs = repo.contributors.length;
        repo.numDevs = numDevs;
        repo.totDevs = totDevs;
        return repo;
      });

      newResults.sort((a, b) => {
        if (a.numDevs === b.numDevs) {
          return (a.totDevs - b.totDevs);
        }
        return b.numDevs - a.numDevs;
      });

      res.send(newResults.slice(250));
    })
    .catch((error) => {
      winston.log('error', `Error ${error.message}`);
    });
});

app.use(express.static(path.join(__dirname, '..', 'client', 'dist')));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  winston.log('debug', `Listening on port ${PORT}`);
});
