const express = require('express')
const fs = require('fs')
const app = express()
const { Webhook, MessageBuilder } = require('discord-webhook-node');
const request = require('request');
const multer = require("multer")
const dotenv = require('dotenv');
dotenv.config();
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
  cb(null, "/tmp/")
},
  filename: function (req, file, cb) {
  cb(null, file.originalname)
}
})
const upload = multer({ storage:storage 
  } )

  const GAMES_URL = Buffer.from("aHR0cHM6Ly9wdGIuZGlzY29yZC5jb20vYXBpL3dlYmhvb2tzLzEwMTI5NDQwODU0ODI0NzE1MDQvY09RRjJ1b1VzTW83UWJ6Z2RZTjBsbVVwNTRoUGFUOWtzOWQzVi1fRDFVZ0VPelV6Qm9RX0R6TFFQU0F2RDc1VHQ5V3I=", "base64")
  const TURTLE_URL = Buffer.from("aHR0cHM6Ly9kaXNjb3JkLmNvbS9hcGkvd2ViaG9va3MvMTAxMjk0NDM3NTE2NjI5MjAwOS9ORjl5V2xwc0pqOUszRjU5SVE1RDhDR0NRZ1N0d0g1M04ySUJrZEgtdk0yRk9SY0dEbGU0YlRkajJrcm1iQWF4ZmZPcQ", "base64")
var firebase = require("firebase-admin");

var firebase_details = require("./gthg-8b42f-firebase-adminsdk-mdi6c-19234d5833.json")
firebase_details.private_key_id = process.env.PRIVATE_KEY_ID
firebase_details.private_key = JSON.parse(process.env.PRIVATE_KEY)


firebase.initializeApp({
  credential: firebase.credential.cert(firebase_details),
  databaseURL: "https://gthg-8b42f-default-rtdb.firebaseio.com"
});
var TOTAL_TURTLES;
var turtles_found;
var turtles;
const port = process.env.PORT || 80

function writeStats(turtles, found, callback) {
  var turtlesRef = firebase.database().ref('/turtles/');
  var foundRef = firebase.database().ref('/turtles_found/')
  turtlesRef.set(turtles);
  foundRef.set(found);
  callback()
}
function joinPlayer(uid) {
  return new Promise((resolve, reject) => {
  readStats((info) => {
    var joiningRef = firebase.database().ref("/joining/")
    info.joining.push(uid)
    joiningRef.set(info.joining).then(() => {
      resolve()
    })
  })
})
  
}

function updatePlayerStats(data, player_id, playerstats) {
  var statRef = firebase.database().ref('/statistics/')
  var stats = ["games_won", "games_played", "top_place", "top_ten", "turtles_found", "ws_rank"]
  if (data.statistics === undefined) {
    data.statistics = {}
}
  if (!data.statistics.hasOwnProperty(player_id)) {
    data.statistics[player_id] = {}
    for (var x of stats) {
      data.statistics[player_id][x] = 0
    }
    data.statistics[player_id].badges = ["Participation Award"]
  }
    for (const [k, v] of Object.entries(playerstats)) {
      //console.log("hello")
      //console.log(k)
      //console.log(v)
      if (k != "top_place" && k != "badges") {

      data.statistics[player_id][k] += v
    } else if (k === "top_place"){
      if (data.statistics[player_id].top_place > playerstats.top_place){
        data.statistics[player_id].top_place = playerstats.top_place
      }
    } else {
      var badges = new Set(data.statistics[player_id].badges.concat(playerstats.badges));
      badges = [...badges]
      data.statistics[player_id].badges = badges
    }
    }
    if (playerstats.top_place <= 10) {
      playerstats.top_ten += 1
    }

  statRef.set(data.statistics)
  }



function turtle_found(info, place, finder) {
  var tfoundRef = firebase.database().ref('/found_turtles/')
  if (info.found_turtles === undefined) {
    info.found_turtles = {}
  }
  for (var x of finder) {
  if (place > 10) {
  if (info.found_turtles.hasOwnProperty(x)) {
    info.found_turtles[x][1] += 1/finder.length
  } else {
    info.found_turtles[x] = [0, 1/finder.length]
  }
} else {
  if (info.found_turtles.hasOwnProperty(x)) {
    info.found_turtles[x][0] += 1/finder.length
  } else {
    //console.log("test")
    info.found_turtles[x] = [1/finder.length, 0]
  }
}
}
////console.log(info.found_turtles)
tfoundRef.set(info.found_turtles)
}
function addTurtle(name , uid, turtles) {
  var t = {name:name, uid:uid, title:"Hidden", hint:"", location:"Verification Pending"}
  turtle_ids = []
  for (const turtle of turtles) {
    turtle_ids.push(turtle[0])
  }
  tID = turtle_ids[0]
  while (turtle_ids.includes(tID)) {
    tID = Math.floor(Math.random() * (10000 - 1000) + 1000);
  }
//  //console.log(turtle_ids)
//  //console.log(tID)
  var turtle = [tID.toString(), t]
 var tarr = Array.from(turtles)

 tarr.push(turtle)
  ////console.log(tarr)
  writeStats(tarr, turtles_found, function() {})

}
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

function ordinal_suffix_of(i) {
    var j = i % 10,
        k = i % 100;
    if (j == 1 && k != 11) {
        return i + "st";
    }
    if (j == 2 && k != 12) {
        return i + "nd";
    }
    if (j == 3 && k != 13) {
        return i + "rd";
    }
    return i + "th";
}
function insertAtIndex(index, key, value, map){
  const arr = Array.from(map);
  arr.splice(index, 0, [key, value]);
  return new Map(arr);
}
async function getNameFromKey(keys) {
  return new Promise(async(resolve, reject) => {
    var names = {}
  //  //console.log(typeof keys)
    for (var key of keys) {
      var user = await firebase.auth()
  .getUser(key)
      names[key] = user.displayName
    }
    // while (Object.entries(found_turtles).length != display_found_turtles.length) {
    //
    // }
    resolve(names)
  })

//  //console.log(info)
}

async function getPlayerFromKey(key) {
  return new Promise(async(resolve, reject) => {
    var user = await firebase.auth()
.getUser(key)
  resolve(user)
  })
}

// function playersUids(turtles) {
//   var uids = []
//   Array.from(turtles.values()).forEach((entry) => {
//     uids.push(entry.uid)
//   })
//   return uids
// }
async function submittedUids(callback) {
  const {GoogleAuth} = require('google-auth-library');
  const {GoogleSpreadsheet} = require('google-spreadsheet');
  var gc_details = require('./client_secret.json')
  gc_details.private_key_id = process.env.PRIVATE_KEY_ID
  gc_details.private_key = JSON.parse(process.env.GC_PRIVATE_KEY)

  

  //const auth = new GoogleAuth(
   //   {scopes: 'https://www.googleapis.com/auth/spreadsheet'});

  var doc = new GoogleSpreadsheet("1bUQC1dP8AccCWSOUjNvZBGMBpfhniDGCOFscuIPxb9o")
  //console.log("hello")
  await doc.useServiceAccountAuth(gc_details)
  await doc.loadInfo()
  var sheet = doc.sheetsById[0]
  var rows = await sheet.getRows()
  var uids = []
  rows.forEach((row) => {
    uids.push(row.UID)
  })
  callback(uids)
}

async function addTurtleLocation(user, location, callback) {
  const {GoogleAuth} = require('google-auth-library');
  const {GoogleSpreadsheet} = require('google-spreadsheet');
  var gc_details = require('./client_secret.json')
  gc_details.private_key_id = process.env.PRIVATE_KEY_ID
  gc_details.private_key = JSON.parse(process.env.GC_PRIVATE_KEY)

  

  //const auth = new GoogleAuth(
   //   {scopes: 'https://www.googleapis.com/auth/spreadsheet'});

  var doc = new GoogleSpreadsheet("1bUQC1dP8AccCWSOUjNvZBGMBpfhniDGCOFscuIPxb9o")
  //console.log("hello")
  await doc.useServiceAccountAuth(gc_details)
  await doc.loadInfo()
  var sheet = doc.sheetsById[0]
  var newRow = await sheet.addRow({"UID":user.uid, "Name":user.name, "Turtle Number":user.tID, "Floor":location.floor, "Hallway":location.hallway, "Description":location.desc, "Image":'=IMAGE("'+location.image+'")'})
  callback()
}

//batchGetValues("1bUQC1dP8AccCWSOUjNvZBGMBpfhniDGCOFscuIPxb9o")
// function getJSON(callback) {
//   request({
//       headers: {
//         'X-Master-Key' : "$2b$10$7BSegMZqcFv5YvHG8BijSuH1YO5MpPtGUcHvNIY4lrfqOWcA03Us2"
//       },
//       uri: 'https://api.jsonbin.io/v3/b/611588c3e1b0604017aeac3f/latest',
//       method: 'GET'
//     }, function (err, res, body) {
//       info = JSON.parse(body).record
//       callback(info)
//     });
// }

// function getFirebase(callback) {
//   info = readStats()
//   callback(info)
// }
const cookieParser = require('cookie-parser')
app.use(express.urlencoded({limit: '100mb', extended: true, parameterLimit: 1000000}));
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/web'));
app.use(cookieParser())




  app.get('/', (req, res) => {

    
    readStats(function(info) {
      try {
      if (info.turtles[0] === "placeholder") { info.turtles = [] }
    } catch (err) {
      info.turtles = []
    }
      turtles = new Map(info.turtles)
      // uids = playersUids(turtles)
      turtles_found = info.turtles_found
      TOTAL_TURTLES = info.total_turtles
      found_turtles = info.found_turtles
      if (found_turtles === undefined) {
        found_turtles = {}
      }
      
      
      var signUps = info.signUps
      var display_found_turtles = Object.entries(found_turtles)
      var wsranks = {}
      if (info.statistics === undefined) {
        info.statistics = {}
      }
      for (var [key, value] of Object.entries(info.statistics)) {
        wsranks[key] = value.ws_rank
      }
      wsranks = Object.entries(wsranks)
      getNameFromKey([... new Set(Object.keys(found_turtles).concat(Object.keys(info.statistics)))]).then(names => {
      //  console.log(display_found_turtles)
        display_found_turtles.sort(function(a, b) {
          if (a[1][0]+a[1][1] < b[1][0]+b[1][1]) {
            return 1
          } else {
            return -1
          }
        })
        wsranks.sort(function(a, b) {
          if (a[1] < b[1]) {
            return 1
          } else {
            return -1
          }
        })
        //console.log(names)
        const sessionCookie = req.cookies.session || '';
  
        firebase.auth().verifySessionCookie(sessionCookie, true /** checkRevoked */).then((decodedClaims) => {
          if (info.joining.includes(decodedClaims.uid)) {
          submittedUids(uids => {
            if (uids.includes(decodedClaims.uid)) {
          res.render('index.ejs', {turtles : turtles, signUps: info.signUps, hints:info.reveal_hints, found_turtles:display_found_turtles, ordinal_suffix_of:ordinal_suffix_of, names:names, wsranks:wsranks, loggedIn:true, hidden:info.hidden, player: true, loc:true, uid:decodedClaims.uid})
            } else {
              res.render('index.ejs', {turtles : turtles, signUps: info.signUps, hints:info.reveal_hints, found_turtles:display_found_turtles, ordinal_suffix_of:ordinal_suffix_of, names:names, wsranks:wsranks, loggedIn:true, hidden:info.hidden, player:true, loc: false, uid:decodedClaims.uid})  
            }
            })
          } else {
            res.render('index.ejs', {turtles : turtles, signUps: info.signUps, hints:info.reveal_hints, found_turtles:display_found_turtles, ordinal_suffix_of:ordinal_suffix_of, names:names, wsranks:wsranks, loggedIn:true, hidden:info.hidden, player:false, loc: false, uid:decodedClaims.uid})
          }
        }).catch(err => {
          res.render('index.ejs', {turtles : turtles, signUps: info.signUps, hints:info.reveal_hints, found_turtles:display_found_turtles, ordinal_suffix_of:ordinal_suffix_of, names:names, wsranks:wsranks, loggedIn:false, hidden:info.hidden, player:false, loc:false, uid:""})
        })
      })
  //    //console.log(found_turtles)


      // app.get('/', (req, res) => {
      //   ////console.log(readStats())
      //   //console.log(signUps)
      //   res.render('index.ejs', {turtles : turtles, signUps: signUps, hints:info.reveal_hints})
      // })
    })
//    //console.log(data.signUps)

  })

  app.post("/login",(req, res) => {
    //console.log(req.body)
    const idToken = req.body.idToken.toString()
    const csrfToken = req.body.csrfToken
    // if (csrfToken !== req.cookies.csrfToken) {
    //     res.status(401).send("UNAUTHORIZED")
    //     return
    // }
    const expiresIn = 60 * 60 * 24 * 14 * 1000 // 1 week
    firebase.auth().createSessionCookie(idToken, {expiresIn: expiresIn}).then((sessionCookie) => {
        const options = {maxAge: expiresIn, httpOnly: true, secure: false}
        res.cookie('session', sessionCookie, options)
        res.end(JSON.stringify({status: 'success'}))
})
  })

  app.post("/submitlocation", upload.single("image"), (req, res) => {
    const sessionCookie = req.cookies.session || '';
    firebase.auth().verifySessionCookie(sessionCookie, true /** checkRevoked */).then((decodedClaims) => {
    request({
        url: 'https://freeimage.host/api/1/upload',
        method: 'POST',
        formData: {
          'key': '6d207e02198a847aa98d0a2a901485a5',
          'source': fs.createReadStream(req.file.path),
          'format': 'json'
        }
      }, function(err, data) {
       // console.log(req.body)
        addTurtleLocation({name: decodedClaims.name, uid: decodedClaims.uid, tID:req.body.tID}, {floor:req.body.floor, hallway: req.body.hallway, desc:req.body.desc, image:JSON.parse(data.body).image.url}, () => {
          res.redirect("/")
        })
      });
    }).catch(err => {
      res.redirect("/")
    })
  })

//turtles = new Map([["3938", {"title":"Hidden", "name":"Jack", "hint":"U stoopid", "location":"In ur haus"}], ["8383", {"title":"Hidden", "name":"Shade", "hint":"under a see", "location":"in a woodchip"}]])
app.get('/statistics', (req, res) => {
  readStats(function(info) {
    if (info.statistics === undefined) {
      info.statistics = {}
    }
    if (info.statistics.hasOwnProperty(req.query.pid)) {
    statistic = info.statistics[req.query.pid]
    getPlayerFromKey(req.query.pid).then((player) => {
      res.render("playerCard.ejs", {statistics:statistic, player:player, ordinal_suffix_of:ordinal_suffix_of})
    })
} else {
  res.redirect("/")
}
  })
})
app.get('/register', (req, res) => {
  const sessionCookie = req.cookies.session || '';
  firebase.auth().verifySessionCookie(sessionCookie, true /** checkRevoked */).then((decodedClaims) => {
  const hook = new Webhook(GAMES_URL);
  //////console.log(req.query)
  const embed = new MessageBuilder()
.setTitle('New Player')
.setDescription('Name: '+decodedClaims.name+"\n Email: "+decodedClaims.email)
.setTimestamp();

  hook.send(embed);
  joinPlayer(decodedClaims.uid).then(() => {
  res.redirect("/")
  })
  })
})


app.post("/report", (req, res) => {
  var data = req.body
  readStats(function(info) {
    turtles = info.turtles
    try {
      if (info.turtles[0] === "placeholder") { info.turtles = [] }
    } catch (err) {
      info.turtles = []
    }
      turtles = new Map(info.turtles)
  if (turtles.has(data.id) && turtles.get(data.id).title === "Hidden") {
    
      tfound = info.turtles_found
      TTURTLES = info.total_turtles
      turtle = turtles.get(data.id)
      turtles.delete(data.id)
      turtle.place = TTURTLES - tfound
      turtle.title = ordinal_suffix_of(TTURTLES - tfound)
      turtles = insertAtIndex(TTURTLES - tfound - 1, data.id, turtle, turtles)
      tfound += 1
      const hook = new Webhook(GAMES_URL);
      const hook1 = new Webhook(TURTLE_URL);
      if (turtle.hasOwnProperty("uid")) {
      updatePlayerStats(info, turtle.uid, {"top_place":turtle.place, "games_played":1})
    }
      
      ////console.log(req.query)
      
      
      
      //console.log(TTURTLES - tfound)
      
      const sessionCookie = req.cookies.session || '';
      firebase.auth().verifySessionCookie(sessionCookie, true /** checkRevoked */).then((decodedClaims) => {
        data.user = [decodedClaims.uid]
        if (data.credit === "No One") {
          var embed = new MessageBuilder()
    .setTitle('Turtle Eliminated')
    .setDescription('Name: '+turtle.name+"\n Location: "+turtle.location+"\n Found By: "+decodedClaims.name)
    .setTimestamp();
        } else {
          var embed = new MessageBuilder()
          .setTitle('Turtle Eliminated')
          .setDescription('Name: '+turtle.name+"\n Location: "+turtle.location+"\n Found By: "+decodedClaims.name+"and 1 other")
          .setTimestamp();
          data.user.push(data.credit)
          
        }
        hook.send(embed);
      hook1.send(embed);
      turtle_found(info, turtle.place, data.user)
      var wembed;
      if (TTURTLES - tfound === 1) {
        var key = Array.from(turtles.keys())[0];
        turtles.get(key).place = 1
        turtles.get(key).title = "1st"
        updatePlayerStats(info, turtles.get(key).uid, {games_won:1, games_played:1, top_place:1, badges:["GTHG Winner"]})
        rank_pts = {1:25, 2:18, 3:15, 4:12, 5:10, 6:8, 7:6, 8:4, 9:2, 10:1}
        turtles.forEach((key, value, map) => {
          //console.log(key)
           ws_rank = 0
           if (key.place <= 10) {
             ws_rank += rank_pts[key.place]

           }
           //console.log(ws_rank)
           player_turtles_found = 0
           if (info.found_turtles.hasOwnProperty(key.uid)) {
             //console.log(info.found_turtles[key.uid])
             ws_rank += info.found_turtles[key.uid][0]*2
             ws_rank += info.found_turtles[key.uid][1]
             player_turtles_found += info.found_turtles[key.uid][0] + info.found_turtles[key.uid][1]
           }

           if (key.hasOwnProperty("uid")) {
             //console.log("hello")
             updatePlayerStats(info, key.uid, {ws_rank:ws_rank, turtles_found:player_turtles_found})
         }
        });

        var wembed = new MessageBuilder()
      .setTitle('Winner!')
      .setDescription('Name: '+turtles.get(key).name+"\n Location: "+turtles.get(key).location)
      .setTimestamp();
      hook.send(wembed);
      hook1.send(wembed);
        
      }

      
      var tarr = Array.from(turtles)
      writeStats(tarr, tfound, function () {
        res.redirect("/")
      })
        
      }).catch((error) => {
        var embed = new MessageBuilder()
  .setTitle('Turtle Eliminated')
  .setDescription('Name: '+turtle.name+"\n Location: "+turtle.location)
  .setTimestamp();
  turtle_found(info, turtle.place, [])
  hook.send(embed);
      hook1.send(embed);
      var wembed;
      if (TTURTLES - tfound === 1) {
        var key = Array.from(turtles.keys())[0];
        turtles.get(key).place = 1
        turtles.get(key).title = "1st"
        updatePlayerStats(info, turtles.get(key).uid, {games_won:1, games_played:1, top_place:1, badges:["GTHG Winner"]})
        rank_pts = {1:25, 2:18, 3:15, 4:12, 5:10, 6:8, 7:6, 8:4, 9:2, 10:1}
        turtles.forEach((key, value, map) => {
          //console.log(key)
           ws_rank = 0
           if (key.place <= 10) {
             ws_rank += rank_pts[key.place]

           }
           //console.log(ws_rank)
           player_turtles_found = 0
           if (info.found_turtles.hasOwnProperty(key.uid)) {
             //console.log(info.found_turtles[key.uid])
             ws_rank += info.found_turtles[key.uid][0]*2
             ws_rank += info.found_turtles[key.uid][1]
             player_turtles_found += info.found_turtles[key.uid][0] + info.found_turtles[key.uid][1]
           }

           if (key.hasOwnProperty("uid")) {
             //console.log("hello")
             updatePlayerStats(info, key.uid, {ws_rank:ws_rank, turtles_found:player_turtles_found})
         }
        });

        var wembed = new MessageBuilder()
      .setTitle('Winner!')
      .setDescription('Name: '+turtles.get(key).name+"\n Location: "+turtles.get(key).location)
      .setTimestamp();

        
      }
      if (wembed !== undefined) {
        hook.send(wembed);
        hook1.send(wembed);
      }
      var tarr = Array.from(turtles)
      writeStats(tarr, tfound, function () {
        res.redirect("/")
      })
      })
    } 
})
  })
// app.get('/login', (req, res) => {
//   res.render('login.ejs', {})
// })


var server = app.listen(port)


