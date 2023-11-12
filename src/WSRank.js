import { useEffect, useState } from "react";
import { getStatistics } from "./js/database";

function WSRank() {
    const [players, setPlayers] = useState(0);

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
            setPlayers(sortedPlayers);
        })
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
    <tr>
      <th scope="row" style={{backgroundColor: index === 0 ? "#FFD70075": index === 1 ? "#C0C0C075" : index === 2 ? "#CD7F3275" : null}}>{index+1}</th>
      <td style={{backgroundColor: index === 0 ? "#FFD70075": index === 1 ? "#C0C0C075" : index === 2 ? "#CD7F3275" : null}}>{stats.name}</td>
      <td style={{backgroundColor: index === 0 ? "#FFD70075": index === 1 ? "#C0C0C075" : index === 2 ? "#CD7F3275" : null}}>{stats.ws_rank|| 0}</td>
    </tr>
    ))}

  </tbody>
</table>
        </div>
    );
}

export default WSRank;