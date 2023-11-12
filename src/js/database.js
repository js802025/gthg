import { getAuth } from "firebase/auth";
import { getDatabase, ref, set, get, onValue, update} from "firebase/database";
import { getStorage, ref as sRef, uploadBytes } from "firebase/storage";

const GAMES_URL = atob("aHR0cHM6Ly9wdGIuZGlzY29yZC5jb20vYXBpL3dlYmhvb2tzLzEwMTI5NDQwODU0ODI0NzE1MDQvY09RRjJ1b1VzTW83UWJ6Z2RZTjBsbVVwNTRoUGFUOWtzOWQzVi1fRDFVZ0VPelV6Qm9RX0R6TFFQU0F2RDc1VHQ5V3I=", "base64").toString()


function registerUser(user) {
    const db = getDatabase();
    return new Promise((resolve, reject) => {
        set(ref(db, 'turtles/' + user.uid), {
            name: getAuth().currentUser.displayName,
        }).then(() => {
            const content = {
                "embeds": [
                    {
                        "title": "New Player",
                        "description": "Name: " + getAuth().currentUser.displayName + "\n Email: " + getAuth().currentUser.email,
                        "timestamp": new Date().toISOString()
                    }]
                }
    
            fetch (GAMES_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(content)
            }).then((response) => {

            resolve();
            }).catch((error) => {
                reject(error);
            }
            )
        }).catch((error) => {
            reject(error);
        });
    });
}

function getTurtles () {
    const db = getDatabase();
    return new Promise((resolve, reject) => {
        get(ref(db, 'turtles')).then((snapshot) => {
            resolve(snapshot.val());
        });
    });
}

function watchTurtles (callback) {
    const db = getDatabase();
    const turtlesRef = ref(db, 'turtles');
    onValue(turtlesRef, (snapshot) => {
        callback(snapshot.val());
    });
}

function getPortalPic (uid) {
    const db = getDatabase();
    return new Promise((resolve, reject) => {
        get(ref(db, 'statistics/' + uid + '/portalPic')).then((snapshot) => {
            resolve(snapshot.val());
        });
    });
}

function isAdmin(uid) {
    const db = getDatabase();
    return new Promise((resolve, reject) => {
        get(ref(db, 'statistics/' + uid + '/admin')).then((snapshot) => {
            resolve(snapshot.val());
        });
    });
}

function setProfilePic (uid, portalPic) {
    const db = getDatabase();
    return new Promise((resolve, reject) => {
        set(ref(db, 'statistics/' + uid + '/portalPic'), portalPic).then(() => {
            resolve();
        });
    });
}

function submitLoc(uid, tID, floor, hallway, desc, image, coords) {
    const db = getDatabase();
    return new Promise((resolve, reject) => {
        update(ref(db, 'turtles/' + uid), {
            id: tID,
            loc: {
            floor: floor,
            hallway: hallway,
            desc: desc,
            coords: coords,
            image: image
            }
        }).then(() => {
            resolve();
        });
    });
}

function uploadFile(id, file) {
    const storage = getStorage();
    return new Promise((resolve, reject) => {
        
        uploadBytes(sRef(storage, "/turtles/"+id), file).then(data => {
          //  console.log(data)
            resolve(data)
        })
    })

}

function getTurtle(tID) {
    return new Promise((resolve, reject) => {
    getTurtles().then((turtles) => {
        for (var key in turtles) {
            if (turtles[key].id === tID) {
                resolve({uid:key, ...turtles[key]});
            }
        }
        resolve(undefined);
    });
})
}

function startCountdown() {
    const db = getDatabase();
    const date = new Date();
    date.setDate(date.getDate() + 1);
    while (date.getDay() === 0 || date.getDay() === 6) {
        date.setDate(date.getDate() + 1);
    }
    return new Promise((resolve, reject) => {
        set(ref(db, 'countdown'), {
            date: date.getTime(),
        }).then(() => {
            resolve(date.getTime());
        });
    });
}

function reportTurtle(uid, tID, credit=[]) {
    const db = getDatabase();
    return new Promise((resolve, reject) => {
        getTurtle(tID).then((turtle) => {
            if (turtle === undefined) {
                reject("Turtle not found");
            } else {
                if (turtle.hasOwnProperty("found")) {
                    reject("Turtle already found");
                } else {
                    set(ref(db, 'turtles/' + turtle.uid + '/found'), {
                        by: [uid].concat(credit),
                        at: new Date().getTime(),
                    }).then(() => {
                        getTurtles().then((turtles) => {
                            var finders = [uid].concat(credit).map((uid) => {
                                return turtles[uid].name;
                            });
                        const content = {
                            "embeds": [
                                {
                                    "title": "Turtle Found",
                                    "description": "Name: " + turtle.name + "\n By: " + finders.join(", "),
                                    "timestamp": new Date().toISOString()
                                }]
                            }
                
                        fetch (GAMES_URL, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(content)
                        }).then((response) => {
                            var turtlesFound = Object.entries(turtles).filter(([key, value]) => {if (value.hasOwnProperty("found")) return true; else return false;}).length;
                            console.log(Object.entries(turtles).length- turtlesFound === 1);
                            if (Object.entries(turtles).length- turtlesFound === 1) {
                                startCountdown().then((date) => {
                                    resolve();
                                })
                            } else {
                                resolve();
                            }

                        }).catch((error) => {
                            reject(error);
                        }
                        )
                    }).catch((error) => {
                        reject(error);
                    });
                })
                }
            }
        });
    });
}

function verify(uid) {
    const db = getDatabase();
    return new Promise((resolve, reject) => {
        update(ref(db, 'turtles/' + uid + '/found'), {
            verified: true
        }).then(() => {
            resolve();
        });
    });
}

function getCountdown() {
    const db = getDatabase();
    return new Promise((resolve, reject) => {
        get(ref(db, 'countdown')).then((snapshot) => {
            resolve(snapshot.val());
        });
    });
}

function getStatistics() {
    const db = getDatabase();
    return new Promise((resolve, reject) => {
        get(ref(db, 'statistics')).then((snapshot) => {
            resolve(snapshot.val());
        });
    });
}

function getGameState() {
    const db = getDatabase();
    return new Promise((resolve, reject) => {
        get(ref(db, 'hidden')).then((snapshot) => {
            resolve(snapshot.val());
        });
    });
}


export { registerUser, getTurtles, watchTurtles, getPortalPic, isAdmin, setProfilePic, submitLoc, uploadFile, reportTurtle, verify, getCountdown, getStatistics, getGameState};