const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const path = require('path')
const fs = require('fs')
const PORT = process.env.PORT || 3000
const fileUpload = require('express-fileupload')

app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname,'public')))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors());
app.use(fileUpload())

app.get("/", (req, res) => {
    res.render("index")
})

app.post("/home", (req, res) => {
    res.render("index")
})

app.get("/explore", (req, res) => {
    const fileList = fs.readdirSync(`./views/stories`);
    fs.readFile(`./views/stories/${fileList[0]}/index.ejs`, 'utf8', function(err, data) {
       res.render("explore", {
          data1: fileList,
          desp1: data.slice(309, 420)+"..."
       })
    })
})

app.get("/add_story", (req, res) => {
    res.render("add_story")
})

function getAllDate() {
   let date = new Date()
   let year = date.getFullYear()
   let month = parseInt(date.getMonth())+1
   let day = date.getDate()
   let hours = date.getHours()
   let minutes = date.getMinutes()
   if(month.toString().length == 1) { month = `0${date.getMonth()+1}` }
   if(day.toString().length == 1) { day = `0${date.getDate()}` }
   if(hours.toString().length == 1) { hours = `0${date.getHours()}` }
   if(minutes.toString().length == 1) { minutes = `0${date.getMinutes()}` }
   return `${year}-${month}-${day} ${hours}:${minutes}`
}

app.post("/newstory", async(req,res) => {

function dateChanger(got) {  return `${got.slice(0,4)}${got.slice(5,7)}${got.slice(8,10)}${got.slice(11,13)}${got.slice(14,16)}`; }
let dd = dateChanger(getAllDate())
await req.files.img1.mv('./public/uploads/' + dd + '_1.jpg');
await req.files.img2.mv('./public/uploads/' + dd + '_2.jpg');

const content = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Share-story</title>
    <link rel="stylesheet" href="story.css" />
  </head>
  <body>
    <h1>Share Story</h1>
    <h2>${req.body.title1}</h2>
    <p>${req.body.para1}</p>
    <div id="img-center">
       <img src="uploads/${dd}_1.jpg" width="300" alt="Image not found" />
    </div>
    <p>${req.body.para2}</p>
    <div id="img-center">
       <img src="uploads/${dd}_2.jpg" width="300" alt="Image not found" />
    </div>
    <p>${req.body.para3}</p>
    <p>Uploaded On: ${getAllDate()}<br />
        <a href="">Report this story</a>
    </p>
    <footer><b>share story</b> copyright ©2023-2024</footer>
  </body>
</html>
`;

const folderName = `./views/stories/${req.body.title1}`;
try {
  if (!fs.existsSync(folderName)) {
    fs.mkdirSync(folderName);
    fs.writeFile(`${folderName}/index.ejs`, content, err => {
       if (err) { console.error(err) }
         res.render('index')
    })
  }
} catch (err) { console.error(err) }
})

app.get("/stories", (req, res) => {
   res.render(`stories/${req.query.id}`)
})

app.listen(PORT, () => {
    console.log(`Server Listening on http://127.0.0.1:${PORT}`)
})
