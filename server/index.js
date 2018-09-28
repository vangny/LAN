const express = require('express');
const bodyparser = require('body-parser');

const app = express();

app.use(bodyparser.json());
app.use(static(`${__dirname}/../client/dist`));

var port = process.env.PORT || 9000

app.listen(port, () => {
    console.log(`Listening on ${port}`);
});