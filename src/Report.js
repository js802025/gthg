import { getTurtles, reportTurtle } from "./js/database";
import { useEffect, useState } from "react";

function Report ({user}) {
  const [turtles, setTurtles] = useState(0);

  useEffect(() => {
   getTurtles().then((turtles) => {
        setTurtles(turtles);
    });
  }, []);
  if (turtles === 0) return;


    return (<div class="modal fade text-white" id="report" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content bg-dark" >
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLongTitle">Report a Turtle</h5>
        </div>
        <div class="modal-body">
          <form onSubmit={handleSubmit}>
<div class="form-group">
<label for="turtle">Turtle ID Number</label>
<input type="text" class="form-control" id="turtle" name="id" aria-describedby="emailHelp" placeholder="Enter ID"/>
<small id="emailHelp" class="form-text text-muted">This is the number displayed on the shell of the turtle.</small>
</div>
<div class="form-group">
<label for="turtle"><b>Optional:</b> Share the credit with 1 other person:</label>
<select name="credit" id="credit" class="form-control">
<option>No One</option>
{turtles !== null && Object.entries(turtles).map(([key, value],index) => (
  user.uid !== key && <option value={key}>{value.name}</option>
))}
</select>
</div>
<button type="submit" class="btn btn-primary" data-bs-dismiss="modal">Submit</button>
</form>
        </div>
      </div>
    </div>
  </div>)

  function handleSubmit(e) {
    e.preventDefault();
    var id = document.getElementById("turtle").value;
    var credit = document.getElementById("credit").value;
   
    if (credit === "No One") {
     reportTurtle(user.uid, id).then(() => {
        alert("Reported Turtle");
    }).catch((err) => {
        alert(err);
    });
  } else {
    reportTurtle(user.uid, id, [credit]).then(() => {
        alert("Reported Turtle");
    }).catch((err) => {
        alert(err);
    });
  }
}
}

export default Report;