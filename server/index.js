const express = require('express');
const bodyparser = require('body-parser');
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');
const db = require('../db/index');

const schema = buildSchema(`
  type Query {
    hello(data: String!): String,
    sup: Int,
    rollDice(numDice: Int!, numSides: Int): [Int]
  }
  type Mutation {
    createPerson(name: String, age: Int) : Person!
  }

  type Person {
    name: String!,
    age: Int!
  }
`);

const root = {
  hello: ({ data }) => {
    return ((data) => {
      console.log(data);
      return data;
    })(data);
  },
  sup: () => 1 + 1,
  rollDice: ({ numDice, numSides }) => {
    const output = [];
    for (let i = 0; i < numDice; i += 1) {
      output.push(1 + Math.floor(Math.random() * (numSides || 6)));
    }
    return output;
  },
  createPerson: ({ name, age }) => {
    const person = new Person();
    person.name = name;
    person.age = age;
  },
};


const app = express();

app.use(bodyparser.json());
app.use(express.static(`${__dirname}/../client/dist`));
app.use('/graphql', graphqlHTTP({
  schema,
  rootValue: root,
  graphiql: true,
}));

const port = process.env.PORT || 9000;

app.get('/home', (req, res) => {
  console.log('PINGED!');
  db.getAlerts().then((alerts) => {
    res.status(201).send(alerts.map(alert => alert.dataValues));
  });
});

app.get('/coordinates', (req, res) => {
  console.log('grabbing coordinates...');
  db.getCoordinates().then((coordinates) => {
    res.status(201).send(coordinates.map(data => data.dataValues));
  });
});

app.post('/alert/api/events', (req, res) => {
  const {
    latitude, longitude, category, timeStamp,
  } = req.body;
  // console.log(latitude, longitude, category, timeStamp);
  db.checkEvents(category, latitude, longitude, timeStamp)
    .then((result) => { // the result will be the event object that was just created
      console.log('server returns: ', result);
      res.send(result);
    });
  // res.sendStatus(201);
});

app.post('/alert/api/alerts', (req, res) => {
//   console.log('alert received by server', req.body);
  const {
    EventId, category, latitude, longitude, notes, photo, photoTag,
  } = req.body;

  db.createAlert(EventId, category, latitude, longitude, notes, photo, photoTag)
    .then(() => { // the result will be the media object that was just created
      // console.log('Do this after saving alert/media to db');
      // console.log(`AlertId: ${result.dataValues.AlertId}`);
      // console.log('retrieved alerts: ', db.getAlerts());
      db.getAlerts().then((alerts) => {
        // console.log(alerts.map(alert => alert.dataValues));
        // res.end(JSON.stringify(alerts.map(alert => alert.dataValues)));
        res.status(201).send(alerts.map(alert => alert.dataValues));
      });
    });
});

app.listen(port, () => {
  console.log(`Listening on ${port}`, 'Running a GraphQL API server at localhost:9000/graphql');
});
