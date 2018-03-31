const dotenv = require('dotenv');

dotenv.config();
const axios = require('axios');
const winston = require('winston');
const db = require('./db');


winston.level = 'debug';

const REQUEST_HEADERS = {
  headers: {
    'User-Agent': 'request',
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
    const response = await axios.get(nextURL, REQUEST_HEADERS);

    nextURL = response.headers.link
      ? response.headers.link.slice(1, response.headers.link.indexOf('>'))
      : null;

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


const language = 'javascript';
const minStars = 1000;
const url = `https://api.github.com/search/repositories?q=+language:${language}+stars:>=${minStars}+sort:stars`;

downloadRepos(url)
  .then((repoList) => {
    repoList.slice(0, 1).forEach((repo) => {
      winston.log('debug', 'repo:', repo.full_name);

      // for each repo, get contributors
      downloadContributors(repo.contributors_url)
        .then(allContribs => allContribs.map(contrib => downloadUserInfo(contrib.url)
          .then((userInfo) => {
            winston.log('debug', `  ${repo.name} :: ${contrib.login} ==> ${userInfo.name}`);
            Object.assign(contrib, userInfo);
            return contrib;
            // store contrib somewhere
          })))
        .then((contributors) => {
          Promise.all(contributors)
            .then((allContributors) => {
              const locationDict = allContributors.reduce((memo, contrib) => {
                memo[contrib.location] = memo[contrib.location]
                  ? memo[contrib.location] + contrib.contributions
                  : contrib.contributions;
                return memo;
              }, {});

              repo.contributors = allContributors;
              repo.gravity = locationDict;

              // store into DB
              db.save(repo);
            });
        });
    });
  });

process.on('SIGINT', () => {
  console.log('\nCache hits', userCacheHits);
  process.exit();
});
