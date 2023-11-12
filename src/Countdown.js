import { useEffect, useState } from "react";
import { getTurtles, getCountdown } from "./js/database";
import Countdown from 'react-countdown';


function CountdownElim() {
    const [countdown, setCountdown] = useState(0);
    const [turtleName, setTurtleName] = useState(0);
    const [retrieved , setRetrieved] = useState(0);
    useEffect(() => {
        getCountdown().then((countdown) => {
            if (countdown) {
                getTurtles().then((turtles) => {
                    var lastTurtle = Object.entries(turtles).filter(([key, value]) => {if (value.hasOwnProperty("found")) return false; else return true;})[0];
                    setTurtleName(lastTurtle[1].name);
                    setCountdown(countdown.date);
                    setRetrieved(countdown.retrieved || false);
                })
            }
        })
    }, [])
    const renderer = ({ days, hours, minutes, seconds, completed }) => {
        if (completed) {
            return (<h2 className="font-weight-bold">VICTORY OVERTURNED</h2>)
        } else {
            return <h2 className="font-weight-bold">{days !== 0 && days+" days, "}{hours} hours, {minutes} minutes, {seconds} seconds</h2>;
        }
        };
    if (countdown === 0 || turtleName === 0) return;
    if (!retrieved) {
    return (
        <div className="row mt-4">
            <h4>{turtleName} has:</h4>
            <Countdown date={countdown} renderer={renderer}></Countdown>
            <h4>left to find their own turtle and return it to a turtle master.</h4>
        </div>
    )} else {
        return (
            <div className="row mt-4">
                <h2 className="font-weight-bold">{turtleName} has won the Great Turtle Hiding Game!</h2>
            </div>
        )
            }
        }

            export default CountdownElim;