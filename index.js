const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const { v4: uuidV4 } = require('uuid');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname,'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());


function getAllDate(options) {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  if(options) return now.getTime();
  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

const { neon } = require("@neondatabase/serverless");
const sql = neon(process.env.DATABASE)
app.get("/", (req, res) => {
    res.render("index");
})

app.get("/explore", async (req, res) => {
  const result = await sql`SELECT * FROM story ORDER BY created DESC`;
  res.render("explore", { list: result } );
})

app.get("/add_story", (req, res) => {
    res.render("add_story");
});

app.post("/newstory", async (req,res) => {
  const { title, para, img1, img2 } = req.body;
  const result = await sql`INSERT INTO story (title, story, image1, image2, created, uuid) VALUES (${title}, ${para}, ${img1}, ${img2}, ${getAllDate()}, ${uuidV4()}) returning *`;
  if (result.length > 0) {
    res.redirect("/");
  } else {
    res.send('Error creating story');
  }
})

app.get("/story", async (req, res) => {
   const uuid = req.query.id;
   const [ result ] = await sql`SELECT * FROM story WHERE uuid = ${uuid}`;
   res.render("story", { list: result });
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server Listening on PORT: ${PORT}`);
});
