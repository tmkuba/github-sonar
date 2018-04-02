import axios from 'axios';

// const URL = process.env.AJAX_URL || 'http://localhost:5000';

const search = searchTerm => axios.get(`/locations/${searchTerm}`)
  .then((response) => {
    // console.log('AJAX success!', response);

    // transform response.data
    if (response.status === 200) {
      // const regex = new RegExp(searchTerm, 'i');

      // calculate weight in search term
      // const gravity = Object.keys(repo.gravity).reduce((acc, key) => {
      //   if (key.match(regex) !== null) {
      //     acc.inLocation += repo.gravity[key];
      //   }
      //   if (key !== 'null') {
      //       acc.nonLocation += repo.gravity[key];
      //     }
      //   acc.nonLocationWithNull += repo.gravity[key];

      //   return acc;
      // }, {
      //   inLocation: 0,
      //   nonLocation: 0,
      //   nonLocationWithNull: 0,
      // });

      // console.log(gravity);

    //   response.data = response.data.map((repo) => {
    //     const numDevs = repo.contributors.reduce((acc, user) => {
    //       const loc = user.location ? user.location : '';
    //       if (loc.match(regex) !== null) {
    //         acc += 1;
    //       }
    //       return acc;
    //     }, 0);
    //     const totDevs = repo.contributors.length;
    //     repo.numDevs = numDevs;
    //     repo.totDevs = totDevs;
    //     return repo;
    //   });

    //   response.data.sort((a, b) => {
    //     if (a.numDevs === b.numDevs) {
    //       return (a.totDevs - b.totDevs);
    //     }
    //     return b.numDevs - a.numDevs;
    //   });
    }

    return response;
  })
  .catch((error) => {
    console.log('AJAX error', error.message);
  });

module.exports = {
  search,
};
