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
      filteredList: [],
      filter: 'All',
      repoFocus: DEFAULT_REPO_FOCUS,
      userFocus: DEFAULT_USER_FOCUS,
    };

    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.handleRepoClick = this.handleRepoClick.bind(this);
    this.handleUserClick = this.handleUserClick.bind(this);
    this.handleFilterClick = this.handleFilterClick.bind(this);
  }

  componentDidMount() {
    this.search('Nepal');
  }

  // EVENT HANDLING
  //

  handleFilterClick(evt) {
    const filter = evt.target.id;
    let newList;
    if (filter === this.state.filter) {
      return;
    }

    if (filter === 'All') {
      newList = this.state.repoList;
    } else {
      newList = this.state.repoList.filter(item => item.language === filter);
    }
    this.setState({
      filteredList: newList,
      filter,
    });
  }

  handleKeyUp(e) {
    if (e.keyCode === 13) {
      if (this.state.searchVal.length > 0) {
        this.handleSearch();
      }
    }
  }

  handleSearch() {
    if (this.state.searchVal.length > 0) {
      this.search(this.state.searchVal);
      this.setState({
        searchVal: '',
      });
    }
  }

  handleSearchChange(e) {
    this.setState({
      searchVal: e.target.value,
    });
  }

  handleRepoClick(id) {
    // console.log('handleRepoClick', repoId);
    // const newRepoFocus = this.state.repoList.find(repo => repo.id === repoId);

    this.setState({
      waiting: true,
    });

    // get new repo focus object
    helper.getContributors(id)
      .then((response) => {
        if (response.status === 200) {
          this.setState({
            errorMessage: '',
            repoFocus: response.data,
            userFocus: DEFAULT_USER_FOCUS,
          });
        } else {
          this.setState({
            errorMessage: response,
            message: '',
          });
        }
      })
      .catch((error) => {
        this.setState({
          errorMessage: error.message,
          message: '',
        });
      })
      .finally(() => {
        this.setState({
          waiting: false,
        });
      });

    // set as this.state.repoFocus
    // this.setState({
    //   repoFocus: newRepoFocus,
    //   userFocus: DEFAULT_USER_FOCUS,
    // });
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
      errorMessage: '',
      message: 'Searching...',
    });

    helper.search(searchTerm)
      .then((response) => {
        // console.log('componentDidMount', response);
        if (response.status === 200) {
          let filteredList;
          if (this.state.filter === 'All') {
            filteredList = response.data;
          } else {
            filteredList = response.data.filter(item => item.language === this.state.filter);
          }
          this.setState({
            errorMessage: '',
            message: `Searched for '${searchTerm}'`,
            repoList: response.data,
            filteredList,
            userFocus: DEFAULT_USER_FOCUS,
            repoFocus: DEFAULT_REPO_FOCUS,
          });
        } else {
          this.setState({
            errorMessage: response,
            message: '',
          });
        }
      })
      .catch((error) => {
        this.setState({
          errorMessage: error.message,
          message: '',
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
    const googleMapImage = `https://maps.googleapis.com/maps/api/staticmap?center=${this.state.lastSearched}&zoom=9&size=600x135&key=${process.env.GOOGLE_API_KEY}`;

    return (
      <div>
        <div className="header">
          <div className="leftTop">
            <h1>
              GitHub Sonar
            </h1>
            <div className="searchBar">
              <input
                disabled={this.state.waiting}
                id="searchBar"
                type="text"
                placeholder="Where shall we try next?"
                value={this.state.searchVal}
                onChange={this.handleSearchChange}
                onKeyUp={this.handleKeyUp}
              />
              <button
                className="goBtn"
                disabled={this.state.waiting}
                onClick={this.handleSearch}
              >
                Go!
              </button>
            </div>
            <div className="filter">
              {
                ['JavaScript', 'Python', 'Go', 'All'].map(lang => (
                  <button
                    className={this.state.filter === lang ? 'filterBtn activeBtn' : 'filterBtn'}
                    id={lang}
                    onClick={this.handleFilterClick}
                  >
                    {lang}
                  </button>))
              }
            </div>
            <div className="message">
              { this.state.message }
              { this.state.errorMessage }
            </div>
          </div>
          <div className="map">
            <img src={googleMapImage} alt="map" />
          </div>
        </div>
        <div className="container">
          <RepoList
            list={this.state.filteredList}
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

export default App;
