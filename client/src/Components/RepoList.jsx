import React from 'react';
import PropTypes from 'prop-types';

const RepoList = ({ list, clickHandler }) => (
  <div>
    <ul>
      { list.map(repo => (
        <li onClick={() => clickHandler(repo.id)} >
          <div><a href={repo.html_url}>{repo.full_name}</a> - {repo.description}</div>
          <div>Stars: {repo.stargazers_count} | {repo.language}</div>
        </li>)) }
    </ul>
  </div>);

RepoList.propTypes = {
  list: PropTypes.arrayOf(PropTypes.object).isRequired,
  clickHandler: PropTypes.func.isRequired,
};


export default RepoList;
