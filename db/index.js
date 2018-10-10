const Sequelize = require('sequelize');
const moment = require('moment');
require('dotenv').config();

const sequelize = new Sequelize(`${process.env.DB_URL}`);

sequelize.authenticate()
  .then(() => {
    console.log('DB successfully established');
  });

/* =======User Authentication=========== */
const User = sequelize.define('User', {
  name: { type: Sequelize.STRING },
  email: { type: Sequelize.STRING },
  provider: { type: Sequelize.STRING },
  provider_id: { type: Sequelize.INTEGER },
  picture: { type: Sequelize.STRING },
  token: { type: Sequelize.INTEGER },
  homeLat: { type: Sequelize.DECIMAL(25, 20) },
  homeLong: { type: Sequelize.DECIMAL(25, 20) },
});

const doesUserExist = (email) => {
  return User.find({ where: { email } })
    .then(data => data ? true : false)
    .catch(err => console.log(err));
};

const Event = sequelize.define('Event', {
  latitude: { type: Sequelize.DECIMAL(25, 20) },
  longitude: { type: Sequelize.DECIMAL(25, 20) },
  category: { type: Sequelize.STRING },

});


const Alert = sequelize.define('Alert', {
  latitude: { type: Sequelize.DECIMAL(25, 20) },
  longitude: { type: Sequelize.DECIMAL(25, 20) },
  notes: { type: Sequelize.STRING },
  category: { type: Sequelize.STRING },
  url: { type: Sequelize.STRING },
  photoTag: { type: Sequelize.STRING },
  // event_id: { type: Sequelize.NUMBER },
  // user_id: { type: Sequelize.NUMBER }
});

// const Media = sequelize.define('Media', {
  // url: { type: Sequelize.STRING },
  // photoTag: { type: Sequelize.STRING },
  // alert_id: { type: Sequelize.INTEGER }
// });

Event.hasMany(Alert, { as: 'Alerts' });
Alert.belongsTo(Event);
// Alert.hasMany(Media, { as: 'Media' });
// Media.belongsTo(Alert);
// Alert.hasOne(User); 
User.hasMany(Alert, { as: 'Alerts' });

sequelize.sync();

const distance = (lat1, lon1, lat2, lon2) => {
  const radlat1 = Math.PI * lat1 / 180;
  const radlat2 = Math.PI * lat2 / 180;
  const theta = lon1 - lon2;
  const radtheta = Math.PI * theta / 180;
  let dist = Math.sin(radlat1) * Math.sin(radlat2)
           + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
  if (dist > 1) {
    dist = 1;
  }
  dist = Math.acos(dist);
  dist = dist * 180 / Math.PI;
  dist = dist * 60 * 1.1515;
  return dist;
};

const findOrCreateEvent = (category, latitude, longitude, timeStamp) => {
  const addEvent = () => Event.create({ category, latitude, longitude });
  return (
    Event.findAll({ where: { category } })
      .then((results) => {
        console.log('checking category...');
        if (results.length > 0) {
          for (let i = 0; i < results.length; i += 1) {
            const event = results[i].dataValues;
            console.log('checking time difference & distance...');
            if (moment(timeStamp).subtract(24, 'hours') < moment(event.updatedAt) // event within 24 hrs
            && distance(event.latitude, event.longitude, latitude, longitude) < 10) { // coordinate distance < 10 mi
              console.log('****Event within time frame and radius already exists!*******');
              return event;
            }
          }
        }
        console.log('******adding new event!********');
        return (addEvent()
          .then(result => result.dataValues));
      })
  );
};

const createAlert = (EventId, category, latitude, longitude, notes, photo, photoTag) => {
  return Alert.create({
    EventId, category, latitude, longitude, notes, url: photo, photoTag,
  }).then(alert => alert);
};


const getAlerts = (srcLat, srcLong, range) => (
  Alert.findAll({ order: [['createdAt', 'DESC']] })
    .then(alerts => (alerts.filter(alert => distance(
      srcLat, srcLong, alert.dataValues.latitude, alert.dataValues.longitude,
    ) <= range)
    ))
);

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

const getCoordinates = () => (
  Alert.findAll({ attributes: ['latitude', 'longitude'] })
);

const getMedia = () => (
  Media.findAll({ order: [['createdAt', 'DESC']] })
);

exports.Event = Event;
exports.User = User;
exports.Alert = Alert;
// exports.Media = Media;
exports.findOrCreateEvent = findOrCreateEvent;
exports.createAlert = createAlert;
exports.getAlerts = getAlerts;
exports.getCoordinates = getCoordinates;
// exports.getMedia = getMedia;
exports.doesUserExist = doesUserExist;
// exports.addUser = addUser;
