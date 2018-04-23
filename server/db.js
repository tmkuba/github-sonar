const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI);

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

  locations: [String],

  locations_gravity: {
  },

  companies: [String],

  companies_gravity: {
  },
});

const contribSchema = mongoose.Schema({
  id: { type: Number, unique: true },
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
const Contributor = mongoose.model('Contributor', contribSchema);

const saveRepo = repo => Repo.create(repo);

const getRepo = id => Repo.findOne({ id }).lean();

const updateRepo = (id, data) => Repo.update({ id }, data);

const getIDs = () => Repo.find().select('id');

const findLocation = searchTerm => Repo.find({ locations: new RegExp(searchTerm, 'i') }).sort('-stargazers_count').lean();

const findCompany = searchTerm => Repo.find({ companies: new RegExp(searchTerm, 'i') }).sort('-stargazers_count').lean();

const saveContributors = contributors => Contributor.create(contributors);

const getContributors = id => Contributor.findOne({ id }).lean();

module.exports = {
  saveRepo,
  getRepo,
  updateRepo,

  getIDs,

  findLocation,
  findCompany,

  saveContributors,
  getContributors,

  mongoose,
};
