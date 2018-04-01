import React from 'react';
import PropTypes from 'prop-types';

const UserInfo = ({ user }) => (
  user.login
    ? (
      <div className="column">
        <div><img className="avatar" src={user.avatar_url} alt="avatar" /></div>
        <div><a href={user.html_url}>{user.login}</a> | {user.name}</div>
        <div>Bio: {user.bio}</div>
        <div>Location: {user.location}</div>
        <div>
          | Blog: {user.blog}
          | Company: {user.company}
          | Contributions: {user.contributions}
          | Created: {user.created_at}
          | Followers: {user.followers}
          | Public Repos: {user.public_repos}
        </div>
      </div>)
    : (<div className="column" />));

UserInfo.defaultProps = {
  user: {},
};

UserInfo.propTypes = {
  user: PropTypes.shape({
    avatar_url: PropTypes.string,
    html_url: PropTypes.string,
    login: PropTypes.string,
    name: PropTypes.string,
    bio: PropTypes.string,
    location: PropTypes.string,
    blog: PropTypes.string,
    company: PropTypes.string,
    created_at: PropTypes.string,
    followers: PropTypes.number,
    contributions: PropTypes.number,
    public_repos: PropTypes.number,
  }),
};

export default UserInfo;
