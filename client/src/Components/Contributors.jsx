import React from 'react';
import PropTypes from 'prop-types';

const Contributors = ({
  repo, clickHandler, searchTerm, focusID,
}) => (
  repo.full_name
    ? (
      <div className="column">
        <ul>
          { repo.contributors.map((user) => {
            const highlight = user.location
              ? (user.location.match(new RegExp(searchTerm, 'i')) !== null)
              : false;
            let classes = 'contributor';
            classes += highlight ? ' highlight' : '';
            classes += focusID === user.id ? ' selected' : '';
            return (
              <li className={classes} onClick={() => clickHandler(user.id)}>
                <div><img className="mini_avatar" src={user.avatar_url} alt="avatar" /></div>
                <div><a href={user.html_url}>{user.login}</a> | {user.location} | {user.name}</div>
                <div>
                  Contributions: {user.contributions}
                   | Followers: {user.followers}
                   | Repos: {user.public_repos}
                </div>
              </li>);
          }) }
        </ul>
      </div>)
    : (<div className="column" />));

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
