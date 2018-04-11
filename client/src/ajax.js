import axios from 'axios';

// const URL = process.env.AJAX_URL || 'http://localhost:5000';

const search = searchTerm => axios.get(`/locations/${searchTerm}`)
  .then(response => response)
  .catch((error) => {
    console.log('AJAX error', error.message);
  });

const getContributors = repoID => axios.get(`/repos/${repoID}/contributors`)
  .then(response => response)
  .catch((error) => {
    console.log('AJAX error', error.message);
  });

module.exports = {
  search, getContributors,
};
