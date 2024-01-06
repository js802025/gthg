import { useState } from "react";
import { getTurtles } from "./js/database";
function AdminPanel() {
    const [turtles, setTurtles] = useState(0);
    getTurtles().then((turtles) => {
        setTurtles(Object.entries(turtles));
    })
    if (turtles === 0) return (<div></div>)

  return (
    <div>
      <h1>Admin Panel</h1>
      <button className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#adminPanel">Open Admin Panel</button>
        <div className="modal fade" id="adminPanel" tabIndex="-1" aria-labelledby="adminPanelLabel" aria-hidden="true">
            <div className="modal-dialog modal-xl">
            <div className="modal-content  bg-dark">
                <div className="modal-header">
                <h5 className="modal-title" id="adminPanelLabel">Admin Panel</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
    
                <div className="modal-body">
                <div className="row">
                    <div className="col">
                    <h3>Active Turtles</h3>
                    <table className="table table-dark">
                        <thead>
                        <tr><th scope="col">Name</th>
                        {window.innerWidth > 1000 &&
                            <th scope="col">UID</th>
                        }
                            <th scope="col">Hidden</th>
                            <th scope="col">Found</th>
                        </tr>
                        </thead>
                        <tbody>
                        {turtles.map(([uid, turtle]) => {
                            return (
                            <tr key={uid} className={turtle.loc == undefined ? "table-warning" : turtle.found !== undefined ? "table-danger" : ""}>
                                <th scope="row">{turtle.name}</th>
                                {window.innerWidth > 1000 &&
                                <td>{uid}</td>
                        }   
                                <td>{turtle.loc !== undefined? "Yes" : "No"}</td>
                                <td>{turtle.found !== undefined? "Yes" : "No"}</td>
                            </tr>
                            )
                        })}
                        </tbody>
                    </table>
                    </div>
                    <div className="col">
                    <h3>Turtles by Floor</h3>
                    <table className="table table-dark">
                        <thead>
                        <tr>
                            <th scope="col">Floor</th>
                            <th scope="col"># of Turtles</th>
                        </tr>
                        </thead>
                        <tbody>
                        {[1, 2, 3, 4].map((floor) => (
                        <tr>
                            <th scope="row">{floor}</th>
                            <td>{turtles.reduce((total, current) => {
                                return total + (current[1].loc !== undefined && parseInt(current[1].loc.floor) === floor && current[1].found === undefined ? 1 : 0)
                            }, 0)}</td>
                        </tr>
                        ))}
                        </tbody>
                    </table>
                    </div>
                </div>
                </div>
    
                <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
    </div>
            </div>
            </div>
        </div>
    </div>
  );
}

export default AdminPanel;