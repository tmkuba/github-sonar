const dotenv = require('dotenv');
const path = require('path');
const winston = require('winston');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const redis = require('redis');
const bluebird = require('bluebird');

bluebird.promisifyAll(redis.RedisClient.prototype);

// const webpack = require('webpack');
// const middleware = require('webpack-dev-middleware');
// const config = require('../webpack.config.js');
const db = require('./db');

dotenv.config();
// const compiler = webpack(config);

const REDIS_TTL = 60 * 60 * 24 * 30; // 30 day expiration

const app = express();
app.use(morgan('dev'));

// app.use(middleware(compiler));
const REDIS_HOST = process.env.REDIS_HOST || 'localhost';

const client = redis.createClient(6379, REDIS_HOST);


// serve static files
app.use(express.static(path.join(__dirname, '..', 'client', 'dist')));

// CORS headers
const whitelist = [
  'http://d1wj09ghjopny0.cloudfront.net',
  'https://d1wj09ghjopny0.cloudfront.net',
  'http://github-sonar.s3.amazonaws.com',
  'https://github-sonar.s3.amazonaws.com',
  'http://github-sonar.us-west-2.elasticbeanstalk.com',
  'https://github-sonar.us-west-2.elasticbeanstalk.com',
  'http://www.githubsonar.com',
  'https://www.githubsonar.com',
  'http://githubsonar.com',
  'https://githubsonar.com',
  'http://api.githubsonar.com',
  'https://api.githubsonar.com',
];

const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1 || origin === undefined) {
      callback(null, true);
    } else {
      callback(new Error(`Not allowed by CORS: ${origin}`));
    }
  },
};

app.use(cors(corsOptions));

// handle GET for searching locations
app.get('/locations/:searchTerm', (req, res) => {
  const { searchTerm } = req.params;
  const searchTermLower = searchTerm.toLowerCase();
  winston.log('debug', `Searching for ${searchTermLower}`);

  const redisKey = `locations-${searchTermLower}`;

  client.getAsync(redisKey)
    .then((redisVal) => {
      if (redisVal === null) {
        const regex = new RegExp(searchTermLower, 'i');

        db.findLocation(searchTermLower)
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

            const topRepos = newResults.slice(0, 150);
            res.send(topRepos);
            client.set(redisKey, JSON.stringify(topRepos), 'EX', REDIS_TTL);
          })
          .catch((error) => {
            winston.log('error', `Error ${error.message}`);
          });
      } else {
        // return the cached value
        res.setHeader('Content-Type', 'application/json');
        res.send(redisVal);
      }
    })
    .catch((err) => {
      winston.log('error', `Redis Error ${err.message}`);
    });
});

// handle GET for getting contributor list
app.get('/repos/:id/contributors', (req, res) => {
  const { id } = req.params;
  winston.log('debug', `Contributors for ${id}`);

  const redisKey = `repos-${id}`;

  client.getAsync(redisKey)
    .then((redisVal) => {
      if (redisVal === null) {
        db.getContributors(id)
          .then((results) => {
            // console.log(results);
            res.send(results);
            client.set(redisKey, JSON.stringify(results), 'EX', REDIS_TTL);
          })
          .catch((error) => {
            winston.log('error', `Error ${error.message}`);
          });
      } else {
        res.setHeader('Content-Type', 'application/json');
        res.send(redisVal);
      }
    })
    .catch((err) => {
      winston.log('error', `Redis Error ${err.message}`);
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  winston.log('debug', `Listening on port ${PORT}`);
});
