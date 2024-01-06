import logo from './logo.svg';
import './App.scss';
import PlayerCard from './PlayerCard';
import "bootstrap"
import { getAuth } from "firebase/auth";
import { useEffect, useState } from 'react';
import { join, login } from './js/script';
import { getGameState, isAdmin, watchTurtles } from './js/database';
import Location from './Location';
import Report from './Report';
import TurtlesFound from './TurtlesFound';
import CountdownElim from './Countdown';
import WSRank from './WSRank';
import Header from './Header';
import AdminPanel from './AdminPanel';

function App() {
  const auth = getAuth();
  const [user, setUser] = useState(null);
  const [turtles, setTurtles] = useState(0)
  const [sortedTurtles, setSortedTurtles] = useState(0)
  const [gameState, setGameState] = useState(0);
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setUser(user);
      isAdmin(user.uid).then((admin) => {
        setAdmin(admin);
      }
      )
    });
    watchTurtles(turtles => {
      if (turtles === null) turtles = {};
      setTurtles(turtles);
      var turtlesSorted = Object.entries(turtles).sort((a, b) => {
        if (a[1].hasOwnProperty("found")) {
            if (b[1].hasOwnProperty("found")) {
                return b[1].found.at - a[1].found.at;
            } else {
              console.log("a");
                return 1;
            }
        } else {
            if (b[1].hasOwnProperty("found")) {
                return -1;
            } else {
              console.log("b");
              if (!a[1].hasOwnProperty("loc")) {
                return 1;
              } else if (!b[1].hasOwnProperty("loc")) {
                return 1;
              }else {
                return 0;
              }
            }
        }
    }).filter((val) => val[1].hasOwnProperty("loc"))
    //console.log(turtlesSorted);
    setSortedTurtles(turtlesSorted);
    })

    getGameState().then((state) => {
      setGameState(state);
    })

  }, []);
  if (turtles === 0 || sortedTurtles === 0) return;
  return (
    <div className="App text-white">
      <nav class="navbar">
      <div class="container">
    <a class="navbar-brand">
      <img src="https://cdn.discordapp.com/attachments/803804130182692965/1125976804600070215/turtlewpaper.png" alt="GTHG" width="40" height="30"/>
    </a> 
    <div className='d-flex flex-row-reverse' >
      {user === null &&
    <button type="button" className="btn pl-4 text-light btn-primary" onClick={login}>
          Login
        </button>}
    <button type="button" className="btn pl-4 ms-2 me-2 text-light" style={{backgroundColor: "#FA321D"}} data-bs-toggle="modal" data-bs-target="#report">
          Report a Turtle
        </button>
        </div>
  </div>
   
        {user && <Report user={user}></Report>}
</nav>
      <header className="App-header">
        <div className='container'>
       
          <div className='row'>

            <div className='col-12 titleDiv text-black shadow rounded-5'>
              <div className='row d-flex' style={{height:"100%"}}>
          <div className='col-2 align-items-center d-flex justify-content-center' >
        <h1  className="title my-auto">G<br/>T<br/>H<br/>G</h1>
</div><div className='col-1 d-flex align-items-center'>
  <div style={{height:"80%", width:"6px", background:"white", opacity:"0.1"}} className='rounded'></div>
  </div><div className='col-9 text-white'>
        <h1 className='secondary-title'>The Great Turtle Hiding Game</h1>
        <p className="lead text-white">Hide Turtle, Find Turtles, Join the Game</p>
        <h5>Game 9 Playing Area:</h5>
        <img src="https://cdn.discordapp.com/attachments/803804130182692965/1119717331787071608/Building_cool0138.png" className='img-fluid' width="50%" alt="logo" /><br/>
        {gameState == 0 ?
        (user && turtles.hasOwnProperty(user.uid)) ? turtles[user.uid].hasOwnProperty("loc") ? <h2 className=''>Get Ready to Find Turtles</h2> : <button className='btn btn-primary' data-bs-toggle="modal" data-bs-target="#submitLoc">Submit Location</button> : 
        <button className="btn-primary btn" onClick={(user && turtles.hasOwnProperty(user.uid)) ? null : join}>{user === null ? "Sign Up" : (turtles.hasOwnProperty(user.uid)) ? "Submit Location": "Join Now"}</button>: gameState == 1 ? <h2 className=''>Get Ready to Find Turtles</h2> : <h2 className=''>Game 9 is off! Find the turtles!</h2>}
        </div>
        </div>
        </div>
        </div>
        </div>
      </header>
      <div className='container'>
        <CountdownElim/>
        <div className='row d-flex '>
          {sortedTurtles.map(([key, value],index) => (
            <PlayerCard player={{place:value.hasOwnProperty("loc") ? value.hasOwnProperty("found") ? index+1 : "Hidden" : "Not Hidden", uid:key, ...value}} uid={user ?user.uid: null}></PlayerCard>
          ))}
          </div>
          <TurtlesFound turtlesSorted={sortedTurtles}/>
          <WSRank/>
          {admin && <AdminPanel/>}
    </div>
    <div className="modal fade" id="submitLoc" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div className="modal-dialog">
    <div className="modal-content  bg-dark">
      <div className="modal-header">
        <h1 className="modal-title fs-5" id="exampleModalLabel">Submit Location</h1>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className="modal-body">
            <Location user={user}></Location>
      </div>
    </div>
  </div>
</div>
    </div>
  );
}

export default App;
