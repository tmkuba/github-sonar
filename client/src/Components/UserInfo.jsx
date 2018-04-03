import React from 'react';
import PropTypes from 'prop-types';
import Octicon from 'react-component-octicons';

const UserInfo = ({ user }) => {
  const name = user.name
    ? (<div className="userInfoLineMain"><a href={user.html_url}><Octicon name="mark-github" /> {user.login}</a> &bull; {user.name}</div>)
    : (<div className="userInfoLineMain"><a href={user.html_url}><Octicon name="mark-github" /> {user.login}</a></div>);

  const location = user.location
    ? (<div className="userInfoLineMain"><Octicon name="location" /> {user.location}</div>)
    : null;

  const bio = user.bio
    ? (<div className="userInfoLineBio"><Octicon name="quote" /> {user.bio}</div>)
    : null;

  let blogURL;
  if (user.blog && user.blog.startsWith('http')) {
    blogURL = user.blog;
  } else {
    blogURL = `http://${user.blog}`;
  }

  const blog = user.blog
    ? (<div className="userInfoLine"><Octicon name="bookmark" /> <a href={blogURL}>{user.blog}</a></div>)
    : null;

  const org = user.company
    ? (<div className="userInfoLine"><Octicon name="organization" /> {user.company}</div>)
    : null;

  return user.login
    ? (
      <div className="column">
        <div className="userInfo">
          <div className="userInfoLineMain"><img className="avatar" src={user.avatar_url} alt="avatar" /></div>
          {name}
          {location}
          {bio}
          <hr />
          {blog}
          {org}
          <div className="userInfoLine"><Octicon name="git-pull-request" /> Contributions: {user.contributions}</div>
          <div className="userInfoLine"><Octicon name="heart" /> Followers: {user.followers}</div>
          <div className="userInfoLine"><Octicon name="repo" /> Repos: {user.public_repos}</div>
        </div>
      </div>)
    : (<div className="column" />);
};


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
