const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

mongoose.connect(process.env.MONGO_URI);

mongoose.connection.on('disconnected', () => {
  console.log('MONGOOSE DISCONNECTED');
});

const repoSchema = mongoose.Schema({
  id: { type: Number, unique: true },
  name: String,
  full_name: String,
  description: String,
  homepage: String,

  owner_login: String,
  owner_id: Number,
  owner_avatar_url: String,
  owner_html_url: String,

  stargazers_count: Number,
  language: String,

  html_url: String,
  url: String,
  contributors_url: String,

  gravity: {
  },

  contributors: [{
    id: Number,
    login: String,
    avatar_url: String,
    html_url: String,
    url: String,
    Type: String,
    contributions: Number,

    name: String,
    company: String,
    location: String,
    email: String,
    bio: String,
    followers: Number,
    created_at: String,
    blog: String,
    public_repos: Number,
  }],
});

const Repo = mongoose.model('Repo', repoSchema);

const save = (repo) => {
  const myRepo = new Repo(repo);

  myRepo.save((error) => {
    if (error) {
      console.log('Repo.save error', error.name, error.message);
    }
  });
};

module.exports = {
  save, mongoose,
};