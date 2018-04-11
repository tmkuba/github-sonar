import React from 'react';
import PropTypes from 'prop-types';
import Octicon from 'react-component-octicons';

const Contributors = ({
  repo, clickHandler, searchTerm, focusID,
}) => {
  const output = repo.id !== 0
    ? (
      <div className="column">
        <h3>
          Contributors
        </h3>
        <ul>
          { repo.contributors.map((user) => {
            const highlight = user.location
              ? (user.location.match(new RegExp(searchTerm, 'i')) !== null)
              : false;
            let classes = 'contributor';
            classes += highlight ? ' highlight' : '';
            classes += focusID === user.id ? ' selected' : '';

            let lineTwo;
            if (user.location && user.company) {
              lineTwo = (
                <div className="contributorLocation">
                  <Octicon name="location" /> {user.location} &bull; {user.company}
                </div>);
            } else if (user.location) {
              lineTwo = (
                <div className="contributorLocation">
                  <Octicon name="location" /> {user.location}
                </div>);
            } else if (user.company) {
              lineTwo = (
                <div className="contributorLocation">
                  <Octicon name="organization" /> {user.company}
                </div>);
            } else {
              lineTwo = null;
            }

            const name = user.name
              ? (
                <div className="contributorMain">
                  <a href="#"><Octicon name="mark-github" /> {user.login}</a>
                    &nbsp;&bull; {user.name}
                </div>)
              : (
                <div className="contributorMain">
                  <a href="#"><Octicon name="mark-github" /> {user.login}</a>
                </div>);

            return (
              <li className={classes} key={user.id} onClick={() => clickHandler(user.id)}>
                <div>
                  <img className="mini_avatar" src={user.avatar_url} alt="avatar" />
                </div>
                <div className="contributorText">
                  {name}
                  {lineTwo}
                  <div className="contributorSecond">
                    <Octicon name="git-pull-request" /> {user.contributions}
                     &nbsp;&bull; <Octicon name="heart" /> {user.followers}
                     &nbsp;&bull; <a href={user.html_url}>Profile <Octicon name="link-external" /></a>
                  </div>
                </div>
              </li>);
          }) }
        </ul>
      </div>)
    : (<div className="column" />);
  return output;
};


Contributors.propTypes = {
  repo: PropTypes.shape({
    id: PropTypes.number.isRequired,
    contributors: PropTypes.array.isRequired,
  }).isRequired,
  clickHandler: PropTypes.func.isRequired,
  searchTerm: PropTypes.string.isRequired,
  focusID: PropTypes.number.isRequired,
};

export default Contributors;
