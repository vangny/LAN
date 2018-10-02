const express = require('express');
const bodyparser = require('body-parser');
const db = require('../db/index.js');
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');

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
  sup: () => {
    return 1 + 1;
  },
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
  }
};


const app = express();

app.use(bodyparser.json());
app.use(express.static(`${__dirname}/../client/dist`));
app.use('/graphql', graphqlHTTP({
  schema,
  rootValue: root,
  graphiql: true,
}))

const port = process.env.PORT || 9000;


app.post('/alert/api/events', (req, res) => {
  const { 
    latitude,
    longitude,
    category,
    timeStamp,
  } = req.body;
  // console.log(latitude, longitude, category, timeStamp);
  db.checkEvents(category, latitude, longitude, timeStamp)
    .then((result) => {
      console.log('server returns: ', result);
      res.send(result)
    });
  // res.sendStatus(201);
});

app.post('/alert/api/alerts', (req, res) => {
  console.log(req.body);
  res.sendStatus(201);
});

app.listen(port, () => {
  console.log(`Listening on ${port}`, 'Running a GraphQL API server at localhost:9000/graphql');
});
