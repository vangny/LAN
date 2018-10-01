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
    latitude: { type: Sequelize.DECIMAL(25, 20) },
    longitude: { type: Sequelize.DECIMAL(25, 20) },
    category: { type: Sequelize.STRING }

});


const Alert = sequelize.define('Alert', {
    latitude: { type: Sequelize.DECIMAL(25, 20) },
    longitude: { type: Sequelize.DECIMAL(25, 20) },
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

const distance = (lat1, lon1, lat2, lon2) => {
  const radlat1 = Math.PI * lat1 / 180;
  const radlat2 = Math.PI * lat2 / 180;
  const theta = lon1 - lon2;
  const radtheta = Math.PI * theta / 180;
  let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
  if (dist > 1) {
    dist = 1;
  }
  dist = Math.acos(dist);
  dist = dist * 180 / Math.PI;
  dist = dist * 60 * 1.1515;
  return dist;
}

const checkEvents = (category, latitude, longitude, timeStamp) => {
  const addEvent = () => Event.create({ category, latitude, longitude });

  return (
    Event.findAll({ where: { category } })
      .then((results) => {
        console.log('checking category...')
        if (results.length > 0) {
          for (let i = 0; i < results.length; i += 1) {
            const event = results[i].dataValues;
            console.log('checking time difference...')
            if (moment(timeStamp).subtract(24, 'hours') < moment(event.updatedAt)) {
              console.log('checking distance...');
              if (distance(event.latitude, event.longitude, latitude, longitude) < 10) {
                console.log('Event within time frame and radius already exists!');
                return event;
              }
            }
          }
        } 
        console.log('adding new event!');
        return addEvent();
      })
  );

    // .then((results) => {
    //   if (results.length === 0) {
    //     addEvent()
    //       .then((result) => {
    //         console.log('Added new event to db!', result.dataValues);
    //       });
    //   } else {
    //     for (let i = 0; i < results.length; i += 1) {
    //       const event = results[i].dataValues;
    //       if (moment().format().subtract(24, 'hours') > moment(event.createdAt).format()) {
    //         addEvent()
    //           .then((result) => {
    //             console.log('Added new event to db!', result.dataValues);
    //           });
    //       }
    //     }
    //   }
    // });
};
  // timeStamp = moment(timeStamp).format();
  // console.log(`timeStamp: ${timeStamp}`)
  // const add5 = moment(timeStamp).add(5, 'seconds').format();
  // console.log(`add5: ${add5}`);
  // console.log(timeStamp > add5);
  
  // Event.findOrCreate({
    //   where: {
  //     category,
  //     updatedAt: {
    //       $gte: moment(timeStamp).subtract(24, 'hours').toDate(),
  //     },
  //   },
  //   defaults: { latitude, longitude },
  // }).then((response) => {
  //   console.log('Event: ', response[0].dataValues);
  //   console.log(`New event created? ${response[1]}`);
  //   const lat1 = response[0].dataValues.latitude;
  //   const lon1 = response[0].dataValues.longitude;
  //   console.log('distance between two points: ', distance(lat1, lon1, latitude, longitude));
  // });
//   Event.findAll({
//     where: {
//       category,
//       updatedAt: {
//         $gte: moment(timeStamp).subtract(24, 'hours').toDate(),
//       },
//     },
//   }).then((results) => {
//     results.forEach((result) => {

//       const lat1 = result.dataValues.latitude;
//       const lon1 = result.dataValues.longitude;

//       console.log('distance between two coords: ', distance(lat1, lon1, latitude, longitude));

//       if (distance(lat1, long1, latitude, longitude) < 10) {
//         return result.dataValues.id;
//       }
//       Event.create({ latitude, longitude, category });
//     });
//   });
// };

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