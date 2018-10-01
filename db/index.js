const Sequelize = require('sequelize');
const moment = require('moment');
require('dotenv').config();

console.log(process.env.DB_URL);
const sequelize = new Sequelize(`${process.env.DB_URL}`);

sequelize.authenticate()
    .then(() => {
        console.log('DB successfully established');
    })


const User = sequelize.define('User', {
    name: { type: Sequelize.STRING }
});

const Event = sequelize.define('Event', {
    latitude: { type: Sequelize.DECIMAL },
    longitude: { type: Sequelize.DECIMAL },
    category: { type: Sequelize.STRING }

});


const Alert = sequelize.define('Alert', {
    latitude: { type: Sequelize.DECIMAL },
    longitude: { type: Sequelize.DECIMAL },
    // events_category: { type: Sequelize.STRING },
    // event_id: { type: Sequelize.NUMBER },
    // user_id: { type: Sequelize.NUMBER }
});

const Media = sequelize.define('Media', {
    url: { type: Sequelize.STRING },
    // alert_id: { type: Sequelize.INTEGER }
})

Event.hasMany(Alert, { as: 'Alerts' });
Alert.belongsTo(Event);
// Alert.hasMany(Media);
Media.belongsTo(Alert);
// Alert.hasOne(User); 
User.hasMany(Alert, { as: 'Alerts' });

sequelize.sync();

const checkEvents = (category, latitude, longitude, timeStamp) => {
  // timeStamp = moment(timeStamp).format();
  // console.log(`timeStamp: ${timeStamp}`)
  // const add5 = moment(timeStamp).add(5, 'seconds').format();
  // console.log(`add5: ${add5}`);
  // console.log(timeStamp > add5);
  
  Event.findOrCreate({
    where: {
      category,
      updatedAt: {
        $gte: moment(timeStamp).subtract(24, 'hours').toDate(),
      },
    },
    defaults: { latitude, longitude },
  }).then((response) => {
    console.log('Event: ', response[0].dataValues);
    console.log(`New event created? ${response[1]}`);
  });
  
};

// const addUser = (user) => {
//     console.log('creating user');
//     Users.upsert({ user })
//         .then(()=> {
//         console.log('entered user!')
//         })
//         .catch(() => {
//             console.log('could not enter user');
//         })
// }

exports.Event = Event;
exports.User = User;
exports.Alert = Alert;
exports.Media = Media;
exports.checkEvents = checkEvents;
// exports.addUser = addUser;