var firebase = require("firebase-admin");
require('dotenv').config()
var firebase_details = require("./gthg-8b42f-firebase-adminsdk-mdi6c-19234d5833.json")
firebase_details.private_key_id = process.env.PRIVATE_KEY_ID
firebase_details.private_key = JSON.parse(process.env.PRIVATE_KEY)


firebase.initializeApp({
  credential: firebase.credential.cert(firebase_details),
  databaseURL: "https://gthg-8b42f-default-rtdb.firebaseio.com"
});

function readStats(callback) {
    var playerRef = firebase.database().ref('/');
  playerRef.once('value', (snapshot) => {
    const data = snapshot.val();
  //  //console.log(data)
  // try {
  // if (data.turtles[0] === "placeholder") { data.turtles = [] }
  // } catch (err) {
  // data.turtles = []
  // }
  // turtles = new Map(data.turtles)
  // turtles_found = data.turtles_found
  // TOTAL_TURTLES = data.total_turtles
  // var signUps = data.signUps
  ////console.log(data)
  ////console.log(data.signUps)
  callback(data)
  });
  }

  function addNameToStats() {
    readStats(function(data) {
      var stats = data.statistics
      Object.entries(stats).forEach(([key, value]) => {
        firebase.auth().getUser(key).then((user) => {
          firebase.database().ref('statistics/' + key + '/name').set(user.displayName).then(() => {
            console.log(user.displayName)
          })
        })
      })
    })
  }
addNameToStats()
//   readStats(function(data) {
//     console.log(data.turtles)
//   })

