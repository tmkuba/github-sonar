import React from 'react';
import PropTypes from 'prop-types';
import Octicon from 'react-component-octicons';

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
          key={repo.id}
          className={focusID === repo.id ? 'repo selected' : 'repo'}
          onClick={() => clickHandler(repo.id)}
        >
          <div className="repoName"><a href="#">{repo.name}</a></div>
          <div className="repoDesc">{repo.description}</div>
          <div className="repoInfo">
            ★ {repo.stargazers_count}
            &nbsp;&bull; {repo.language}
            &nbsp;&bull; {repo.numDevs} / {repo.totDevs}
            &nbsp;&bull; <a href={repo.html_url}>GitHub <Octicon name="link-external" /></a>
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
