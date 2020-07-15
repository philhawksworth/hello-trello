// Some useful variables to expose to our site templsates

require('dotenv').config();
const {
  SITE_URL='https://localhost',
  TRELLO_BOARD_URL='https://trello.com/b/Zzc0USwZ/hellotrello'
} = process.env;


module.exports = {
  "utm": "?utm_source=github&utm_medium=hellotrello-pnh&utm_campaign=devex",
  "host": new URL(SITE_URL).host,
  "trello_board": TRELLO_BOARD_URL
};
