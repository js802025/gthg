import { get } from 'firebase/database';
import React, {useState, useEffect} from 'react';
import { getPortalPic, setProfilePic, isAdmin, verify, getTurtles, downloadFile } from './js/database';


function PlayerCard({player, uid}) {
    const [portalPic, setPortalPic] = useState(0);
    const [admin, setAdmin] = useState(false);
    const [turtles, setTurtles] = useState(0);
    useEffect(() => {
        getPortalPic(player.uid).then((portalPic) => {
            setPortalPic(portalPic);
        });
        isAdmin(uid).then((a) => {
            setAdmin(a);
        });
        getTurtles().then((turtles) => {

            setTurtles(turtles);
        });


    }, [player.uid]);
    if (portalPic === 0) return;
    if (turtles === 0) return;
    if (player.place === "Hidden") {
    return (
        <div className='col-sm-4 mt-2 mx-auto justify-content-center'>
          <a data-bs-toggle={admin ? "modal": null} data-bs-target={admin ? "#player"+player.name.replaceAll(" ", "") : null}>
              <div class="card mx-auto text-white" style={{width: "12rem", backgroundColor:"#3E3E4000", backdropFilter:"blur(12px)"}}>
  {/* <img src={player.portalPic} class="card-img-top p-2" alt="..."/> */}
  <img src={portalPic ? portalPic : "data:image/jpeg;base64,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" }class="card-img-top p-2" alt="..."/>
  <div class="card-body">
    <h5 className='' style={{fontWeight:"bold"}}>{player.name}</h5>
    
  </div>
</div>
</a>
<div class="modal fade" id={"player"+player.name.replaceAll(" ", "")} tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog">
  <div class="modal-content" style={{background:"transparent", border:"none"}}>
    <div class="card mx-auto text-white" style={{width: "20rem", backgroundColor:"#3E3E4000", backdropFilter:"blur(12px)"}}>
    
    <div class="card-body">
    <h2>Set Profile Picture</h2>
    <input type="text" id="portalPic"  className='form-control'></input>
    <button onClick={() => {
        setProfilePic(player.uid, document.getElementById("portalPic").value);
    }} className="btn btn-primary">Set</button>

<div>
    <h5>Floor: {player.loc.floor}</h5>
    <h5>Hallway: {player.loc.hallway}</h5>
    <p>Description: {player.loc.desc}</p>
    <img src={"https://firebasestorage.googleapis.com/v0/b/gthg-8b42f.appspot.com/o/turtles%2F"+player.uid+"-"+player.id+"?alt=media"} className='img-fluid' alt="..."/>
    <svg className="mt-3" >
      <image href={player.loc.floor === "1" ? "https://cdn.discordapp.com/attachments/693929343638044702/1176662745790283776/image.png?ex=656faf93&is=655d3a93&hm=5c2759caf8099123f8a4c8cabc337bdaeacd03b195ebf9b4ff88314adaff3817&" : player.loc.floor === "2" ? "https://i.ibb.co/zJcvY1g/FWP-2nd-FL-Plan-11x17-RD-10-27-17-2.png" : player.loc.floor === "3" ? "https://i.ibb.co/qj79Jhh/FWP-3rd-FL-Plan-11x17-1.png" : player.loc.floor === "4" ? "https://i.ibb.co/wdky6T0/FWP-4th-FL-Plan-11x17-1.png" : null} x="0" y="0" height="100%" width="100%"/>
      <circle cx={(player.loc.coords.x*100/340)+"%"} cy={(player.loc.coords.y*100/220)+"%"} r="5" stroke="red" stroke-width="3" fill="red" />
    </svg>
    </div>
    
</div>
</div>
    </div>
  </div>
</div>
            </div>
    )
    } else if (player.place === "Not Hidden") {
     
        return (
            <div className='col-sm-4 mt-2 mx-auto justify-content-center'>
                <a data-bs-toggle={admin ? "modal": null} data-bs-target={admin ? "#player"+player.name.replaceAll(" ", "") : null}>
            <div class="card mx-auto text-white" style={{width: "12rem", backgroundColor:"#3E3E4000", backdropFilter:"blur(12px)"}}>
{/* <img src={player.portalPic} class="card-img-top p-2" alt="..."/> */}
<img src={portalPic ? portalPic : "data:image/jpeg;base64,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" } class="card-img-top p-2" alt="..."/>
<div class="card-body">
  <h5 className='' style={{fontWeight:"bold"}}>{player.name}</h5>
  <h5>Not Hidden</h5>
  
</div>
</div></a>
<div class="modal fade" id={"player"+player.name.replaceAll(" ", "")} tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog">
  <div class="modal-content" style={{background:"transparent", border:"none"}}>
    <div class="card mx-auto text-white" style={{width: "20rem", backgroundColor:"#3E3E4000", backdropFilter:"blur(12px)"}}>
    
    <div class="card-body">
    <h2>Set Profile Picture</h2>
    <input type="text" id="portalPic"  className='form-control'></input>
    <button onClick={(e) => {
        setProfilePic(player.uid, e.target.parentElement.getElementsByTagName("input")[0].value);
    }} className="btn btn-primary">Set</button>
    
</div>
</div>
    </div>
  </div>
</div>
          </div>)

    } else {
      var finders = player.found.by.map((finder) => {
        return turtles[finder].name
      })
        return (
        <div className='col-sm-4 mt-2 mx-auto justify-content-center'>
            <a data-bs-toggle="modal" data-bs-target={"#player"+player.name.replaceAll(" ", "")}>
              <div class="card mx-auto shadow-lg text-white" style={{width: "12rem", backgroundColor:"#3E3E4000", backdropFilter:"blur(12px)"}}>
  <img src={portalPic ? portalPic : "data:image/jpeg;base64,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" } class="card-img-top p-2" style={{filter:"grayscale(100%)"}} alt="..."/>
  <h2 class="placeShow ">#{player.place}</h2>
  <img className='xShow' style={{"width":"200px"}}src="https://cdn.discordapp.com/attachments/803804130182692965/1120207950418546808/thign.png"></img>
  <div class="card-body">
    <h5 className='t' style={{fontWeight:"bold"}}>{player.name}</h5>
    
  </div>
</div>
            </a>
<div class="modal fade" id={"player"+player.name.replaceAll(" ", "")} tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content" style={{background:"transparent", border:"none"}}>
    
    <div class="card mx-auto text-white" style={{width: "20rem", backgroundColor:"#3E3E4000", backdropFilter:"blur(12px)"}}>
  <img src={portalPic ? portalPic : "data:image/jpeg;base64,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" } class="card-img-top p-2" style={{filter:"grayscale(100%)"}} alt="..."/>
  <h2 class="placeShow placeShowModal">#{player.place}</h2>
  <img className='xShow' style={{"width":"350px", opacity:"0.7"}}src="https://cdn.discordapp.com/attachments/803804130182692965/1120207950418546808/thign.png"></img>
  <div class="card-body">
    <h5 className='' style={{fontWeight:"bold"}}>{player.name}</h5>
    <h5>Found By: {finders.join(", ")}</h5>
    {player.found.verified ? <div>
    <h5>Floor: {player.loc.floor}</h5>
    <h5>Hallway: {player.loc.hallway}</h5>
    <p>Description: {player.loc.desc}</p>
    </div>: <div>

    <p>Location: Verification Pending</p>
    {admin && <button className="btn btn-primary" onClick={() => {
      console.log(player.uid);
      verify(player.uid)}}>Verify</button>}</div>}
    
    </div>
</div>
    </div>
  </div>
</div>
            </div>)
            }
        }

        export default PlayerCard;

