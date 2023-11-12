import React, { useRef, useState} from 'react';
import { uploadFile, submitLoc} from './js/database';

function Location({user}) {
    const canvasRef = useRef(null);
    const [coords, setCoords] = useState({x: 0, y: 0});
    return ( 
      <div className='container'>
        <div className='row justify-content-center d-flex'>
          <div className='col-12 text-white justify-content-center'>
            <div>
      <h1  className="">Submit Location</h1>
      <div class="form-group">
          <input type="text" class="form-control mx-auto" name="tID" id="tID" placeholder="Turtle ID" style={{maxWidth:"500px"}}/>
          <select name="floor" id="floor" class="form-control mt-3 mx-auto" required style={{maxWidth:"500px"}}>
            <option selected disabled>Floor...</option>
            <option>2</option>
            <option>3</option>
            <option>4</option>
          </select>
          <select name="hallway" id="hallway" class="form-control mt-3 mx-auto" required onChange={drawCanvas} style={{maxWidth:"500px"}}>
            <option selected disabled>Hallway...</option>
            <option>North (Catboxes/Main)</option>
            <option>East (Art)</option>
            <option>South (New Gym)</option>
            <option>West (Languages/History and English)</option>
            <option>Wavy</option>
            <option>Model Home (Bathrooms over Big Gym)</option>
            <option>Locker Room/New Gym Entrance</option>
            <option>Auditorium Hallway (2nd Floor Only)</option>
            <option>MS Dean Hallway/Hallway to Choir Room</option>
            <option>Atrium</option>
            <option>Alcove</option>
            <option>NE Stairwell (Outside MS Office)</option>
            <option>NW Stairwell (Main Entrance)</option>
            <option>SE Stairwell (MS Hallway/Art Hallway)</option>
            <option>SW Stairwell (Glass)</option>
            <option>Wavy NE Stairwell (Leads behind SK rooms)</option>
            <option>Wavy NW Stairwell (Leads into the front lawn/Loading Dock)</option>
            <option>Atrium Blue Stairwell</option>
            <option>Atrium Back Stairwell</option>
            
          </select>
          <div id="canvasDiv" class="mt-3 mx-auto"  style={{display:"none"}} >
            <h2>Click on the location of your turtle</h2>
          <canvas width="340" height="220" className="" ref={canvasRef}/>
            </div>
          <textarea class="form-control mt-3 mx-auto" name="desc" id="desc" placeholder="Description of Location" style={{maxWidth:"500px"}}></textarea>
          <label for="image" class="mt-3">Photo of the Location: </label>
          <input type="file" accepts="image/*" name="image" id="image" class="form-control mx-auto" style={{maxWidth:"500px"}}/>
          <p>MAKE SURE YOUR TURTLE IS IN A LEGAL HIDING SPOT(NO PRINTERS)</p>
          <input type="hidden" name="uid" id="uid"/>
          <input type="hidden" name="displayName" id="displayName"/>

          <button type="submit" class="btn btn-primary mt-3" onClick={handleSubmit} data-bs-dismiss="modal">Submit</button>

      </div>
      </div>
      </div>
      </div>
      </div>
)
    function drawCanvas() {
        const canvas = canvasRef.current;
        document.getElementById("canvasDiv").style.display = "block";
        const ctx = canvas.getContext('2d');
        var image = new Image();
        if (document.getElementById("floor").value === "2") {
            image.src = "https://i.ibb.co/zJcvY1g/FWP-2nd-FL-Plan-11x17-RD-10-27-17-2.png"
        } else if (document.getElementById("floor").value === "3") {
            image.src = "https://i.ibb.co/qj79Jhh/FWP-3rd-FL-Plan-11x17-1.png";
        } else {
            image.src = "https://i.ibb.co/wdky6T0/FWP-4th-FL-Plan-11x17-1.png";
        }
    console.log(image.width, image.height);

    // Draw the image on the canvas once it's loaded
    image.onload = function() {
      ctx.drawImage(image, 0, 0, 340, 220);
    };

    // Function to handle mouse click events
    function handleMouseClick(event) {
      var rect = canvas.getBoundingClientRect();
      var x = event.clientX - rect.left;
      var y = event.clientY - rect.top;

      // Clear the canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Redraw the image
      ctx.drawImage(image, 0, 0, 340, 220);

      // Draw a red circle at the clicked point
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, 2 * Math.PI, false);
      ctx.fillStyle = 'red';
      ctx.fill();
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'red';
      ctx.stroke();
    
      setCoords({x: x, y: y});
      console.log('Selected point: (' + x + ', ' + y + ')');
    }

    // Attach the click event listener to the canvas
    canvas.addEventListener('click', handleMouseClick);
    }

    function handleSubmit() {
        uploadFile(user.uid+"-"+document.getElementById("tID").value, document.getElementById("image").files[0]).then((data) => {
            console.log(data);
            submitLoc(user.uid, document.getElementById("tID").value, document.getElementById("floor").value, document.getElementById("hallway").value, document.getElementById("desc").value, data.metadata.fullPath, coords);
        })
    }

}




export default Location;