import React from 'react';
import PropTypes from 'prop-types';

const Contributors = ({ repo, clickHandler, searchTerm }) => (
  <div>
    <div>
      <a href={repo.html_url}>{repo.full_name}</a> | {repo.description}

      <a href={repo.homepage}>Homepage</a>
      | Stars: {repo.stargazers_count}
      | {repo.language}

      {/* repo.gravity repo.locations */}
      {}
    </div>
    <ul>
      { repo.contributors.map((user) => {
        const highlight = user.location
          ? (user.location.match(new RegExp(searchTerm, 'i')) !== null)
          : false;
        return (
          <li className={highlight ? 'highlight' : ''} onClick={() => clickHandler(user.id)}>
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
  </div>);

Contributors.propTypes = {
  repo: PropTypes.shape({
    contributors: PropTypes.array,
    location: PropTypes.string,
  }).isRequired,
  clickHandler: PropTypes.func.isRequired,
  searchTerm: PropTypes.string.isRequired,
};

export default Contributors;
