// Get any environment variables we need
require('dotenv').config();
const {
  TRELLO_LIST_ID,
  TRELLO_TOKEN,
  TRELLO_KEY,
  npm_config_url } = process.env;

const fetch = require('node-fetch');

const body = {
  description: "Netlify build hook",
  callbackURL: npm_config_url,
  idModel: TRELLO_LIST_ID
}

fetch(`https://api.trello.com/1/tokens/${TRELLO_TOKEN}/webhooks/?key=${TRELLO_KEY}`, {
    method: 'post',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  })
  .then(res => res.json())
  .then(json => console.log(json));
