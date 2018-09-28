const Sequelize = require('sequelize');
require('dotenv').config();

console.log(process.env.DB_URL);
const db = new Sequelize(`${process.env.DB_URL}`);

db.authenticate()
    .then(() => {
        console.log('DB successfully established');
    })