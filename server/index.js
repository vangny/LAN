const express = require('express');
const bodyparser = require('body-parser');
const db = require('../db/index.js');

const app = express();

app.use(bodyparser.json());
app.use(express.static(`${__dirname}/../client/dist`));

var port = process.env.PORT || 9000;

// db.addUser()

app.listen(port, () => {
    console.log(`Listening on ${port}`);
});