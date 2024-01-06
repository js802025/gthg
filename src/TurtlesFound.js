import { useEffect, useState } from "react"
import { getTurtles } from "./js/database"

function TurtlesFound({turtlesSorted}) {
    const [finders, setFinders] = useState(0)
    useEffect(() => {
        getTurtles().then((turtles) => {
            var finders = {}
            if (turtles === null) turtles = {};
            for (var key in turtlesSorted) {
                var turtle = turtlesSorted[key][1];
                if (turtle.hasOwnProperty("found") && turtle.found.hasOwnProperty("by")) {
                    
                    for (var uid of turtle.found.by) {
                        if (finders.hasOwnProperty(turtles[uid].name)) {
                            if (key < 9) {
                                finders[turtles[uid].name].top += 1/turtle.found.by.length;
                            } else {
                            finders[turtles[uid].name].under += 1/turtle.found.by.length;
                            }
                        } else {
                            if (key < 9) {
                                finders[turtles[uid].name] = {top:1/turtle.found.by.length, under:0};
                            } else {
                            finders[turtles[uid].name] = {top:0, under:1/turtle.found.by.length};
                            }
                        }
                    }
                }
            }
            finders = Object.entries(finders).sort((a, b) => (b[1].under+(2*b[1].top)) - (a[1].under+(2*a[1].top)));
            setFinders(finders);
        });
    }, [])
    if (finders === 0) return;
    return (
        <div className="row mt-4">
            <h1>Turtles Found</h1>
            <table class="table table-dark">
  <thead>
    <tr>
      <th scope="col">#</th>
      <th scope="col">Name</th>
      <th scope="col">10+</th>
      <th scope="col">Top 10</th>
    </tr>
  </thead>
  <tbody>
    {finders.map(([name, count], index) => (
    <tr>
      <th scope="row" style={{backgroundColor: index === 0 ? "#FFD70075": index === 1 ? "#C0C0C075" : index === 2 ? "#CD7F3275" : null}}>{index+1}</th>
      <td style={{backgroundColor: index === 0 ? "#FFD70075": index === 1 ? "#C0C0C075" : index === 2 ? "#CD7F3275" : null}}>{name}</td>
      <td style={{backgroundColor: index === 0 ? "#FFD70075": index === 1 ? "#C0C0C075" : index === 2 ? "#CD7F3275" : null}}>{count.under}</td>
        <td style={{backgroundColor: index === 0 ? "#FFD70075": index === 1 ? "#C0C0C075" : index === 2 ? "#CD7F3275" : null}}>{count.top}</td>
    </tr>
    ))}

  </tbody>
</table>
        </div>
    )
}

export default TurtlesFound;