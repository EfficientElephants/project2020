#!/usr/bin/env node
const app = require('./app');
const db = require('./mongo');

const port = process.env.PORT || '3001';

db.connect().then(() => {
  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Listening on port: ${port}`);
  });
});
