import React from 'react';

import helper from '../ajax';
import RepoList from './RepoList';
import Contributors from './Contributors';
import UserInfo from './UserInfo';

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
      repoFocus: {
        contributors: [],
      },
      userFocus: {},
    };

    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleRepoClick = this.handleRepoClick.bind(this);
    this.handleUserClick = this.handleUserClick.bind(this);
  }

  componentDidMount() {
    this.search('Nepal');
  }

  // EVENT HANDLING
  //
  handleKeyPress(e) {
    // DEBUG
    console.log('handleKeyPress', e.keyCode);
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
    console.log('handleRepoClick', repoId);
    const newRepoFocus = this.state.repoList.find(repo => repo.id === repoId);
    this.setState({
      repoFocus: newRepoFocus,
    });
  }

  handleUserClick(userId) {
    console.log('handleUserClick', userId);
    const newUserFocus = this.state.repoFocus.contributors.find(user => user.id === userId);
    this.setState({
      userFocus: newUserFocus,
    });
  }


  search(searchTerm) {
    this.setState({
      waiting: true,
    });

    helper.search(searchTerm)
      .then((response) => {
        // console.log('componentDidMount', response);
        if (response.status === 200) {
          this.setState({
            message: `Searched for '${searchTerm}'`,
            repoList: response.data,
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
            onKeyPress={this.handleKeyPress}
          />
          <button
            disabled={this.state.waiting}
            onClick={this.handleSearch}
          >
            Search
          </button>
          <div>
            {this.state.waiting ? 'Searching...' : ''}
          </div>
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
          />
          <Contributors
            repo={this.state.repoFocus}
            clickHandler={this.handleUserClick}
            searchTerm={this.state.lastSearched}
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
