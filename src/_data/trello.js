
// Get any environment variables we need
require('dotenv').config();
const {
  TRELLO_LIST_ID,
  TRELLO_TOKEN,
  TRELLO_KEY,
  ELEVENTY_ENV,
  BRANCH } = process.env;

const fs = require("fs");
const Trello = require("trello");
const trello = new Trello(TRELLO_KEY, TRELLO_TOKEN);
const localDataFile = __dirname + '/local/trello.json';


module.exports = () => {

  // Don't keep hitting the API during local dev,
  // use a previously seeded data file instead.
  if(ELEVENTY_ENV == 'dev') {
    return require(localDataFile);
  }

  // Get the cards on the list we care about
  return trello.getCardsOnList(TRELLO_LIST_ID)
    .then(cards => {

      // only include cards labelled with "live" or with this branch name
      let result = cards.filter(card => {
        return card.labels.filter(
          label => (
            label.name.toLowerCase() == 'live' ||
            label.name.toLowerCase() == BRANCH
          )).length;
      });

      // If we ran the seed script, let's stash this data so we can
      // use it during local development. Just to save our API quotas.
      if(ELEVENTY_ENV == 'seed') {
        fs.writeFile(localDataFile, JSON.stringify(result), err => {
          if(err) {
            console.log(err);
          } else {
            console.log(`Data saved locally for dev: ${localDataFile}`);
          }
        });
      }

      return result;
    })

  }
