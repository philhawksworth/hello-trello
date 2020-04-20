
// Get any environment variables we need
require('dotenv').config();
const {
  TRELLO_BOARD_ID,
  TRELLO_DEV_TOKEN,
  TRELLO_KEY,
  ELEVENTY_ENV,
  BRANCH } = process.env;

const fs = require("fs");
const Trello = require("trello");
const trello = new Trello(TRELLO_KEY, TRELLO_DEV_TOKEN);
const localDataFile = __dirname + '/local/cards.json';


module.exports = () => {

  // don't keep hitting the API during local dev
  if(ELEVENTY_ENV == 'dev') {
    return require(localDataFile);
  }

  return trello.getListsOnBoard(TRELLO_BOARD_ID)
    .then((lists) => {

      // make and index of list ids
      // we can reference by branch name
      var listKeys = {};
      lists.forEach(list => {
        listKeys[list.name.toLowerCase()] = list.id;
      })

      // get the cards from the "live" list
      let listId = listKeys['published'];
      return trello.getCardsOnList(listId)
        .then(cards => {

          // only included cards labelled as "live" or with this branch name
          let result = cards.filter(card => {
            return card.labels.filter(label => (label.name.toLowerCase() == 'live' || BRANCH )).length;
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
    });
}
