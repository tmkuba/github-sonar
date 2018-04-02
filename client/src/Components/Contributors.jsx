import React from 'react';
import PropTypes from 'prop-types';
import Octicon from 'react-component-octicons';

const Contributors = ({
  repo, clickHandler, searchTerm, focusID,
}) => {
  const output = repo.full_name
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

            const location = user.location
              ? (
                <div className="contributorLocation">
                  <Octicon name="location" /> {user.location}
                </div>)
              : null;

            const name = user.name
              ? (
                <div className="contributorMain">
                  <a href={user.html_url}><Octicon name="mark-github" /> {user.login}</a>
                    &nbsp;&bull; {user.name}
                </div>)
              : (
                <div className="contributorMain">
                  <a href={user.html_url}><Octicon name="mark-github" /> {user.login}</a>
                </div>);

            return (
              <li className={classes} onClick={() => clickHandler(user.id)}>
                <div>
                  <img className="mini_avatar" src={user.avatar_url} alt="avatar" />
                </div>
                <div className="contributorText">
                  {name}
                  {location}
                  <div className="contributorSecond">
                    <Octicon name="git-pull-request" /> {user.contributions}
                     &nbsp;&bull; <Octicon name="heart" /> {user.followers}
                     &nbsp;&bull; <Octicon name="repo" /> {user.public_repos}
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
    contributors: PropTypes.array,
    location: PropTypes.string,
  }).isRequired,
  clickHandler: PropTypes.func.isRequired,
  searchTerm: PropTypes.string.isRequired,
  focusID: PropTypes.number.isRequired,
};

export default Contributors;