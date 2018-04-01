module.exports = {
    "extends": "eslint-config-airbnb",
    "env": {
      "jest": true,
      "browser": true,
      "node": true
    },
    "rules": {
      "no-await-in-loop": 1,
      "no-param-reassign": 1,
      "prefer-arrow-callback": 1,
      "jsx-a11y/click-events-have-key-events": 1,
      "jsx-a11y/no-noninteractive-element-interactions": 1,
    },
};