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
    .then(data => data.dataValues)
    .catch(err => console.log(err));
};

const Friendships = sequelize.define('Friendships', {
  user1: { type: Sequelize.INTEGER },
  user2: { type: Sequelize.INTEGER },
});

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

const Location = sequelize.define('Location', {
  latitude: { type: Sequelize.DECIMAL(25, 20) },
  longitude: { type: Sequelize.DECIMAL(25, 20) },
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
User.hasMany(Location);
User.hasMany(Friendships);
// Friendships.hasMany(User);
Location.belongsTo(User);

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

const createAlert = (EventId, category, latitude, longitude, notes, photo, photoTag, userId) => {
  return Alert.create({
    EventId, category, latitude, longitude, notes, url: photo, photoTag,
  }).then(alert => alert);
};


const getAlerts = (srcLat, srcLong, range, category) => ( category !== 'none' ? (
  Alert.findAll({ where: { category }, order: [['createdAt', 'DESC']] })
    .then(alerts => (alerts.filter(alert => distance(
      srcLat, srcLong, alert.dataValues.latitude, alert.dataValues.longitude,
    ) <= range)
    ))
) : (
  Alert.findAll({ order: [['createdAt', 'DESC']] })
    .then(alerts => (alerts.filter(alert => distance(
      srcLat, srcLong, alert.dataValues.latitude, alert.dataValues.longitude,
    ) <= range)
    ))
)
);

const getCoordinates = () => (
  Alert.findAll({ attributes: ['latitude', 'longitude'] })
);

// 
// const newFriends = (userEmail, friendEmail) => {
//   User.findAll({ where: { userEmail, friendEmail } })
//     .then(results => {
//       console.log('Adding users to Friendships...')
//       results.filter((user) => {
//         if (user.id) {
//           Friendships.create(results.id);
//         }
//       })
//     });
// };
const getFriends = userId => (
  Friendships.findAll({ where: { user1: userId } })
    .then(friends => friends.map(friend => friend.dataValues.user2)))
  .then(friendIds => User.findAll({ where: { id: friendIds } }));

const findOrCreateFriendship = (userId, userEmail, friendEmail) => {
  return User.findOne({ where: { email: friendEmail } })
    .then((friend) => {
      return Friendships.findOrCreate({ where: {
        user1: userId,
        user2: friend.dataValues.id,
      }});
    })
    // .then(friendship => {friendship})
    // .catch(err => err);
}

const sendToNotofications = (id) => {
  console.log('DATA in DB', id);
  const userTable = User.findAll({ where: { id: id } });

  const friendsTable = getFriends(id);

  const alerts = Alert.findAll({
    limit: 1,
    order: [['createdAt', 'DESC']],
  });

  return Promise.all([userTable, alerts, friendsTable])
    .then((values) => {
      return values;
    })
    .catch((err) => {
      console.log(err);
    });
}

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
exports.Location = Location;
exports.Friendships = Friendships;
exports.findOrCreateFriendship = findOrCreateFriendship;
exports.getFriends = getFriends;
exports.sendToNotofications = sendToNotofications;
