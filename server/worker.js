const dotenv = require('dotenv');

dotenv.config();
const axios = require('axios');
const winston = require('winston');
const Promise = require('bluebird');
const db = require('./db');

// rate limiting, per https://github.com/axios/axios/issues/230
function promiseDebounce(fn, delay, count) {
  let working = 0;
  const queue = [];
  function work() {
    if ((queue.length === 0) || (working === count)) return;
    working += 1;
    Promise.delay(delay).tap(() => {
      working -= 1;
    })
      .then(work);
    const next = queue.shift();
    next[2](fn.apply(next[0], next[1]));
  }
  return function debounced(...args) {
    return new Promise(function (resolve) {
      queue.push([this, args, resolve]);
      if (working < count) work();
    }.bind(this));
  };
}

const repoGet = promiseDebounce(axios.get, 2010, 1);
axios.get = promiseDebounce(axios.get, 750, 1);

winston.level = 'debug';

const REQUEST_HEADERS = {
  headers: {
    'User-Agent': 'tmkuba',
    Authorization: `token ${process.env.GITHUB_API_KEY}`,
  },
};

const downloadRepos = async (url, pageLimit = 1) => {
  let currentPage = 0;

  let nextURL = url;
  const output = [];
  while (nextURL) {
    if (currentPage >= pageLimit) {
      break;
    }
    winston.log('debug', 'GET', nextURL);
    const response = await repoGet(nextURL, REQUEST_HEADERS);

    // winston.log('debug', response.headers.link);
    if (response.headers.link) {
      const nextIndex = response.headers.link.indexOf('next');
      nextURL = nextIndex === -1
        ? null
        : response.headers.link.slice(
          response.headers.link.lastIndexOf('<', nextIndex) + 1,
          response.headers.link.lastIndexOf('>', nextIndex),
        );
    } else {
      nextURL = null;
    }

    output.push(...response.data.items.map(repo => ({
      id: repo.id,
      name: repo.name,
      full_name: repo.full_name,
      description: repo.description,
      homepage: repo.homepage,

      owner_login: repo.owner.login,
      owner_id: repo.owner.id,
      owner_avatar_url: repo.owner.avatar_url,
      owner_html_url: repo.owner.html_url,

      stargazers_count: repo.stargazers_count,
      language: repo.language,

      html_url: repo.html_url,
      url: repo.url,
      contributors_url: repo.contributors_url,
    })));
    currentPage += 1;
  }
  return output;
};

const downloadContributors = async (url, pageLimit = 1) => {
  let currentPage = 0;

  let nextURL = url;
  const output = [];
  while (nextURL) {
    if (currentPage >= pageLimit) {
      break;
    }
    winston.log('debug', 'GET', nextURL);
    const response = await axios.get(nextURL, REQUEST_HEADERS);

    nextURL = response.headers.link
      ? response.headers.link.slice(1, response.headers.link.indexOf('>'))
      : null;

    output.push(...response.data.map(contributor => ({
      id: contributor.id,
      login: contributor.login,
      avatar_url: contributor.avatar_url,
      html_url: contributor.html_url,
      url: contributor.url,
      type: contributor.type,
      contributions: contributor.contributions,
    })));
    currentPage += 1;
  }
  return output;
};

const userCache = {};
let userCacheHits = 0;

const downloadUserInfo = (url) => {
  if (userCache[url]) {
    userCacheHits += 1;
    return Promise.resolve(userCache[url]);
  }

  return axios.get(url, REQUEST_HEADERS)
    .then((userData) => {
      // console.log('downloadUserInfo', userData.data);
      winston.log('silly', `GOT user info ${userData.data.login}`);
      const user = userData.data;
      const output = {
        name: user.name,
        company: user.company,
        location: user.location,
        email: user.email,
        bio: user.bio,
        followers: user.followers,
        created_at: user.created_at,
        blog: user.blog,
        public_repos: user.public_repos,
      };
      userCache[url] = output;
      return output;
    });
};

const cleanKey = (string = 'null') => {
  let output = string === null ? 'null' : string;
  while (output.startsWith('$')) {
    output = output.slice(1);
  }
  return output;
};

const calcGravities = (allContributors) => {
  // calculate locations_gravity
  const locationGravity = allContributors.reduce((memo, contrib) => {
    const cleanLocation = cleanKey(contrib.location);
    memo[cleanLocation] = memo[cleanLocation]
      ? memo[cleanLocation] + 1
      : 1;
    memo.__total += 1;
    return memo;
  }, { __total: 0 });

  const locationList = Object.keys(locationGravity).filter(item => (item !== '__total' && item !== 'null'));

  // generate companies_gravity
  const companyGravity = allContributors.reduce((memo, contrib) => {
    const cleanCompany = cleanKey(contrib.company);
    memo[cleanCompany] = memo[cleanCompany]
      ? memo[cleanCompany] + 1
      : 1;
    memo.__total += 1;
    return memo;
  }, { __total: 0 });

  const companyList = Object.keys(companyGravity).filter(item => (item !== '__total' && item !== 'null'));

  return {
    locations_gravity: locationGravity,
    locations: locationList,
    companies_gravity: companyGravity,
    companies: companyList,
  };
};


// const language = 'go';
// const minStars = 75;
// const url = `https://api.github.com/search/repositories?q=+language:${language}+stars:>=${minStars}+sort:stars`;

// JavaScript #1000+
// const url = 'https://api.github.com/search/repositories?q=+language:javascript+stars:<=3556+sort:stars';

// Python #1000+
// const url = 'https://api.github.com/search/repositories?q=+language:python+stars:<=1297+sort:stars';

// Go #1000+
// db.repos.find({language: "Go"}).sort({stargazers_count: 1}).limit(2)
// db.repos.find({language: "Go"}).count(); // 1020
const url = 'https://api.github.com/search/repositories?q=+language:go+stars:<=675+sort:stars';

const go = async () => {
  const repoIDs = await db.getIDs();
  const repoDone = repoIDs.reduce((acc, repo) => {
    acc[repo.id] = true;
    return acc;
  }, {});

  // console.log(repoDone, 'repoDone');

  downloadRepos(url, 25)
    .then((repoList) => {
      repoList.forEach((repo) => {
        winston.log('debug', 'repo:', repo.full_name);

        if (repoDone[repo.id]) {
          winston.log('debug', `repo ${repo.name} done, skipping...`);
          return;
        }
        // for each repo, get contributors
        downloadContributors(repo.contributors_url)
          .then(allContribs => allContribs.map(contrib => downloadUserInfo(contrib.url)
            .then((userInfo) => {
              winston.log('silly', `  ${repo.name} :: ${contrib.login} ==> ${userInfo.name}`);
              Object.assign(contrib, userInfo);
              return contrib;
              // store contrib somewhere
            })))
          .then((contributors) => {
            Promise.all(contributors)
              .then((allContributors) => {
                // save contributors separately
                const newContributors = {
                  id: repo.id,
                  contributors: allContributors,
                };

                db.saveContributors(newContributors)
                  .then(() => {
                    winston.log('debug', `saved contributors: ${newContributors.id}`);
                  })
                  .catch((error) => {
                    winston.log('error', `Error saving contributors ${newContributors.id}: ${error.message}`);
                  });

                const newRepo = Object.assign({}, repo, calcGravities(allContributors));

                // store into DB
                db.saveRepo(newRepo)
                  .then(() => {
                    winston.log('debug', `${repo.full_name} saved. [${new Date().toString()}]`);
                    repoDone[repo.id] = true;
                  })
                  .catch((error) => {
                    winston.log('error', `Error saving repo ${repo.name}: ${error.message}`);
                  });
              });
          });
      });
    });
};

go();

process.on('SIGINT', () => {
  console.log('\nCache hits', userCacheHits);
  process.exit();
});
