const fs = require("fs");

require('dotenv').config();

const Trello = require("trello");
const trello = new Trello(process.env.TRELLO_KEY, process.env.TRELLO_DEV_TOKEN );
const boardID = '5e98324e40df9d1269739d4b';
const localDataFile =  __dirname + '/local/trello.json';


module.exports = () => {

  console.log('CAN WE USE THE BRANCH TO AUTOMATICALLY KEY THE TRELLO CONTENT? Branch:', process.env.BRANCH );


  // don't keep hitting the API during local dev
  if(process.env.ELEVENTY_ENV == 'dev') {
    return require(localDataFile);
  }

  let allCards = {};
  let cardPromises = [];

  return trello.getListsOnBoard(boardID)
    .then((lists) => {
      lists.forEach(list => {
        cardPromises.push(
          trello.getCardsOnList(list.id)
            .then(cards => {
              cards.forEach(element => {
                if(!allCards[list.name]) {
                  allCards[list.name] = [];
                }
                allCards[list.name].push(element);
              });
            })
        );
      })

      return Promise.all(cardPromises)
        .then(() => {

          // If we ran the seed script, let's stach this data for use during
          // local development. Just to save our API quotas.
          if(process.env.ELEVENTY_ENV == 'seed') {
            fs.writeFile(localDataFile, JSON.stringify(allCards), err => {
              if(err) {
                console.log(err);
              } else {
                console.log(`Data saved lcoally for dev: ${localDataFile}`);
              }
            });
          }

          // give eleventy the trello cards
          return allCards;
        });

    });

}
