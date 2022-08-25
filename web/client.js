
const config = {
apiKey: "AIzaSyCvz8Sp_ESSh55ad8WeBt6CNJmmVXMEEiE",
authDomain: "gthg-8b42f.firebaseapp.com",
databaseURL: "https://gthg-8b42f-default-rtdb.firebaseio.com",
projectId: "gthg-8b42f",
storageBucket: "gthg-8b42f.appspot.com",
messagingSenderId: "859211708021",
appId: "1:859211708021:web:10bfb2efe47b642e716a3c",
measurementId: "G-B9CT2X5EY6"
};
firebase.initializeApp(config);
vm = {
//     SectionA: ko.observable(''),
//     SectionB: ko.observable(''),
    isUser: ko.observable(isUser()),
    userID: ko.observable(localStorageGet("userID") || ''),
    turtleid: ko.observable(''),
    credit: ko.observable('No One'),
    user: ko.observable(''),
    authCode: ko.observable('')
}
$(function () {
    ko.applyBindings(vm);

});
$().ready(function () {
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      vm.user(true)
      document.getElementById("statspage").href = "/statistics?pid="+user.uid
    } else {
      vm.user(false)
      console.log("not logged in")
      $("#signup-body").show()
      $("#getturtle-body").hide()
      $("#hiding-body").hide()
      $("#finding-body").hide()
      $("#submitloc").hide()
    }
  });
})
var socket = io();
socket.on('connect', function() {
  console.log("Connected")
  socket.on("refresh", function(data) {
    window.location.reload()
  })
  socket.on("isP", (data) => {
    if (data.player) {
      if (data.hidden === 0) {
        $("#signup-body").hide()
        $("#getturtle-body").show()
        $("#hiding-body").hide()
        $("#finding-body").hide()
        $("#submitloc").hide()
      } else if (data.hidden === 1) {
        if (!data.loc) {
          $("#signup-body").hide()
          $("#getturtle-body").hide()
          $("#hiding-body").show()
          $("#finding-body").hide()
          $("#submitloc").show()
        } else {
          $("#signup-body").hide()
          $("#getturtle-body").hide()
          $("#hiding-body").hide()
          $("#finding-body").show()
          $("#submitloc").hide()
        }
      }
    } else {
      $("#signup-body").show()
      $("#getturtle-body").hide()
      $("#hiding-body").hide()
      $("#finding-body").hide()
      $("#submitloc").hide()
      $("#register").modal("show")
    }
  })

})
function report(data) {
//  console.log(data)
  if (vm.user()) {
  if (vm.credit() === "No One") {
  socket.emit("report", {
    id: vm.turtleid(),
    user: [firebase.auth().currentUser]
  })
} else {
  socket.emit("report", {
    id: vm.turtleid(),
    user: [firebase.auth().currentUser, vm.credit()]
  })
}
  vm.turtleid("")
} else {
  socket.emit("report", {
    id: vm.turtleid(),
    user: []
  })
}
}

function register(data) {
  if (isUser()) {
  socket.emit("register", {
    user: firebase.auth().currentUser
  })
}}
function localStorageGet(key) {
    return window.localStorage ? window.localStorage.getItem(key) : null;
}
function localStorageSet(key, value) {
    if (window.localStorage) {
        window.localStorage.setItem(key, value);
    }
}
function isUser() {
  const user = firebase.auth().currentUser;

if (user) {
  return true;
} else {
  return false;
}
}
function claimaccount(data) {
  var user = firebase.auth().currentUser
  socket.emit("claimacc", {pid:user.uid, authCode:vm.authCode()});
}

