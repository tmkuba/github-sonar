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

// handle GET for searching locations
app.get('/locations/:searchTerm', (req, res) => {
  const { searchTerm } = req.params;
  winston.log('debug', `Searching for ${searchTerm}`);

  const regex = new RegExp(searchTerm, 'i');

  db.findLocation(searchTerm)
    .then((results) => {
      winston.log('debug', `${results.length} records found`);

      const newResults = results.map((repo) => {
        const numDevs = Object.keys(repo.locations_gravity).reduce((memo, location) => {
          if (location.match(regex) !== null) {
            memo += repo.locations_gravity[location];
          }
          return memo;
        }, 0);

        repo.numDevs = numDevs;
        repo.totDevs = repo.locations_gravity.__total;

        return repo;
      });

      newResults.sort((a, b) => {
        if (a.numDevs === b.numDevs) {
          return (a.totDevs - b.totDevs);
        }
        return b.numDevs - a.numDevs;
      });

      res.send(newResults.slice(0, 200));
    })
    .catch((error) => {
      winston.log('error', `Error ${error.message}`);
    });
});

// handle GET for getting contributor list
app.get('/contributors/:id', (req, res) => {
  const { id } = req.params;
  winston.log('debug', `Contributors for ${id}`);

  db.getContributors(id)
    .then((results) => {
      // console.log(results);
      res.send(results);
    })
    .catch((error) => {
      winston.log('error', `Error ${error.message}`);
    });
});

// serve static files
app.use(express.static(path.join(__dirname, '..', 'client', 'dist')));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  winston.log('debug', `Listening on port ${PORT}`);
});
