import React from 'react';
import PropTypes from 'prop-types';

const RepoList = ({
  list, clickHandler, focusID,
}) => (
  <div className="column">
    <ul>
      { list.map(repo => (
        <li
          className={focusID === repo.id ? 'selected' : ''}
          onClick={() => clickHandler(repo.id)}
        >
          <div><a href={repo.html_url}>{repo.full_name}</a> - {repo.description}</div>
          <div>
            Stars: {repo.stargazers_count}
            | {repo.language}
            | {repo.numDevs} / {repo.totDevs}
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
