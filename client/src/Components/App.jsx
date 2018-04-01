import React from 'react';

import helper from '../ajax';
import RepoList from './RepoList';
import Contributors from './Contributors';
import UserInfo from './UserInfo';

const DEFAULT_REPO_FOCUS = {
  id: 0,
  contributors: [],
};

const DEFAULT_USER_FOCUS = {
  id: 0,
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: '',
      errorMessage: '',
      waiting: false,

      searchVal: '',
      lastSearched: '',

      repoList: [],
      repoFocus: DEFAULT_REPO_FOCUS,
      userFocus: DEFAULT_USER_FOCUS,
    };

    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.handleRepoClick = this.handleRepoClick.bind(this);
    this.handleUserClick = this.handleUserClick.bind(this);
  }

  componentDidMount() {
    this.search('Nepal');
  }

  // EVENT HANDLING
  //
  handleKeyUp(e) {
    if (e.keyCode === 13) {
      this.handleSearch();
    }
  }

  handleSearch() {
    this.search(this.state.searchVal);
    this.setState({
      searchVal: '',
    });
  }

  handleSearchChange(e) {
    this.setState({
      searchVal: e.target.value,
    });
  }

  handleRepoClick(repoId) {
    // console.log('handleRepoClick', repoId);
    const newRepoFocus = this.state.repoList.find(repo => repo.id === repoId);
    this.setState({
      repoFocus: newRepoFocus,
      userFocus: DEFAULT_USER_FOCUS,
    });
  }

  handleUserClick(userId) {
    // console.log('handleUserClick', userId);
    const newUserFocus = this.state.repoFocus.contributors.find(user => user.id === userId);
    this.setState({
      userFocus: newUserFocus,
    });
  }


  search(searchTerm) {
    this.setState({
      waiting: true,
      message: 'Searching...',
    });

    helper.search(searchTerm)
      .then((response) => {
        // console.log('componentDidMount', response);
        if (response.status === 200) {
          this.setState({
            message: `Searched for '${searchTerm}'`,
            repoList: response.data,
            userFocus: DEFAULT_USER_FOCUS,
            repoFocus: DEFAULT_REPO_FOCUS,
          });
        } else {
          this.setState({
            errorMessage: response,
          });
        }
      })
      .catch((error) => {
        this.setState({
          errorMessage: error.message,
        });
      })
      .finally(() => {
        this.setState({
          waiting: false,
          lastSearched: searchTerm,
        });
      });
  }

  render() {
    return (
      <div>
        <h1>
          Github Sonar
        </h1>
        <div>
          <input
            disabled={this.state.waiting}
            id="searchBar"
            type="text"
            placeholder="Location"
            value={this.state.searchVal}
            onChange={this.handleSearchChange}
            onKeyUp={this.handleKeyUp}
          />
          <button
            disabled={this.state.waiting}
            onClick={this.handleSearch}
          >
            Search
          </button>
        </div>
        <div>
          <img src={`https://maps.googleapis.com/maps/api/staticmap?center=${this.state.lastSearched}&zoom=9&size=500x100`} alt="map" />
        </div>
        <div>
          { this.state.errorMessage }
        </div>
        <div>
          { this.state.message }
        </div>
        <div className="container">
          <RepoList
            list={this.state.repoList}
            clickHandler={this.handleRepoClick}
            searchTerm={this.state.lastSearched}
            focusID={this.state.repoFocus.id}
          />
          <Contributors
            repo={this.state.repoFocus}
            clickHandler={this.handleUserClick}
            searchTerm={this.state.lastSearched}
            focusID={this.state.userFocus.id}
          />
          <UserInfo
            user={this.state.userFocus}
          />
        </div>
      </div>);
  }
}

// const App = () => (<div>Hello World From App!</div>);

export default App;
