import axios from 'axios';

const URL = process.env.AJAX_URL || '';

const search = searchTerm => axios.get(`${URL}/locations/${searchTerm}`)
  .then(response => response)
  .catch((error) => {
    console.log('AJAX error', error.message);
  });

const getContributors = repoID => axios.get(`${URL}/repos/${repoID}/contributors`)
  .then(response => response)
  .catch((error) => {
    console.log('AJAX error', error.message);
  });

module.exports = {
  search, getContributors,
};
