import React from 'react';
import PropTypes from 'prop-types';

const RepoList = ({
  list, clickHandler, focusID,
}) => (
  <div className="column">
    <h3>
      {list.length} Repos
    </h3>
    <ul>
      { list.map(repo => (
        <li
          className={focusID === repo.id ? 'repo selected' : 'repo'}
          onClick={() => clickHandler(repo.id)}
        >
          <div className="repoName"><a href={repo.html_url}>{repo.name}</a></div>
          <div className="repoDesc">{repo.description}</div>
          <div className="repoInfo">
            ★ {repo.stargazers_count} &bull; {repo.language} &bull; {repo.numDevs} / {repo.totDevs}
          </div>
        </li>)) }
    </ul>
  </div>);

RepoList.propTypes = {
  list: PropTypes.arrayOf(PropTypes.object).isRequired,
  clickHandler: PropTypes.func.isRequired,
  focusID: PropTypes.number.isRequired,
};


export default RepoList;
