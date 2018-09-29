const express = require('express');
const bodyparser = require('body-parser');
const db = require('../db/index.js');

const app = express();

app.use(bodyparser.json());
app.use(express.static(`${__dirname}/../client/dist`));

const port = process.env.PORT || 9000;

// db.addUser()

app.post('/alert/api/alerts', (req, res) => {
  console.log(req.body);
  res.sendStatus(201);
});

app.listen(port, () => {
  console.log(`Listening on ${port}`);
});
