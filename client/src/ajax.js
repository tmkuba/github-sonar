import axios from 'axios';

const URL = process.env.AJAX_URL || 'http://localhost:5000';

const search = searchTerm => axios.get(`${URL}/locations/${searchTerm}`)
  .then((response) => {
    console.log('AJAX success!', response);
    return response;
  })
  .catch((error) => {
    console.log('AJAX error!', error.message);
  });

module.exports = {
  search,
};
