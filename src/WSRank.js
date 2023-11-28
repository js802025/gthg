import { useEffect, useState } from "react";
import { getStatistics, isAdmin, mergeAccounts } from "./js/database";
import { getAuth } from "@firebase/auth";
function WSRank() {
    const [players, setPlayers] = useState(0);
    const [admin, setAdmin] = useState(false);
    const [player, setPlayer] = useState(0);
    const auth = getAuth();

    useEffect(() => {
        getStatistics().then((players) => {
            var sortedPlayers = Object.entries(players).sort((a, b) => {
                if (!a[1].hasOwnProperty("ws_rank")) {
                    a[1].ws_rank = 0;
                }
                if (!b[1].hasOwnProperty("ws_rank")) {
                    b[1].ws_rank = 0;
                }
                return b[1].ws_rank - a[1].ws_rank;
            });
            sortedPlayers = sortedPlayers.filter(([key, value]) => value.ws_rank > 0);
            console.log(sortedPlayers);
            setPlayers(sortedPlayers);
        })
        isAdmin(auth.currentUser.uid).then((admin) => {
            setAdmin(admin);
        })
        setPlayer(auth.currentUser.uid);
        }, []);
    if (players === 0) return;
    return (
        <div className="WSRank">
            <h1>All Time</h1>
            <table class="table table-dark">
  <thead>
    <tr>
      <th scope="col">#</th>
      <th scope="col">Name</th>
      <th scope="col">Wit & Skill Pts.</th>
    </tr>
  </thead>
  <tbody>
    {players.map(([uid, stats], index) => (
    <tr data-bs-toggle="modal" href={"#"+uid+"stats"}>
      <th scope="row" style={{backgroundColor: index === 0 ? "#FFD70075": index === 1 ? "#C0C0C075" : index === 2 ? "#CD7F3275" : null}}>{index+1}</th>
      <td style={{backgroundColor: index === 0 ? "#FFD70075": index === 1 ? "#C0C0C075" : index === 2 ? "#CD7F3275" : null}}>{stats.name}</td>
      <td style={{backgroundColor: index === 0 ? "#FFD70075": index === 1 ? "#C0C0C075" : index === 2 ? "#CD7F3275" : null}}>{stats.ws_rank|| 0}</td>
    </tr>
    ))}

  </tbody>
</table>
        {players.map(([uid, stats], index) => (
            <div className="modal fade" id={uid+"stats"} tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog">
              <div className="modal-content  bg-dark">
                <div className="modal-header">
                  <h1 className="modal-title fs-5" id="exampleModalLabel">Player Statitics</h1>
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                    <div className="row">
                      <div className="col-4">
                        <h1>{stats.games_played}</h1>
                        <h4>Games Played</h4>
                        </div>
                        <div className="col-4">
                        <h1>{stats.games_won}</h1>
                        <h4>Games Won</h4>
                        </div>
                        <div className="col-4">
                        <h1>{stats.top_place}</h1>
                        <h4>Highest Position</h4>
                        </div>
                        </div>
                        <div className="row">
                      <div className="col-4">
                        <h1>{stats.turtles_found}</h1>
                        <h4>Turtles Found</h4>
                        </div>
                        <div className="col-4">
                        <h1>{stats.most_turtles_found}</h1>
                        <h4>Most Turtles Found in a Game</h4>
                        </div>
                        <div className="col-4">
                        <h1>{stats.ws_rank}</h1>
                        <h4>Wit and SKill Points</h4>
                        </div>
                        </div>
                    {admin && <div className="row">
                      
                      <div className="col-12">
                        <h2>Merge Accounts</h2>
                        <select name="merge" id="merge" class="form-control mt-2">
                          <option selected disabled>Account to Merge</option>
                          {players.map(([uid, stats], index) => (
                            <option value={uid}>{stats.name}</option>
                          ))}
                        </select>
                        <button className="btn btn-primary mt-2" onClick={(e) => {
                          var merge =  e.target.parentElement.getElementsByTagName("select")[0].value;
                          mergeAccounts(uid, merge);
                        }}>Merge</button>
                    </div>
                    </div>}

                </div>
              </div>
            </div>
          </div>
        ))}
        </div>


    );
}

export default WSRank;