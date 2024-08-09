const express = require("express");
const app = express();
const path = require("path")
const fs = require("fs")

app.set("view engine", "ejs")
app.use(express.json())
app.use(express.static(path.join(__dirname, "public")))
app.use(express.urlencoded({ extended: true }))

//show all files
app.get("/", (req, res) => {
  fs.readdir("./files", (err, files) => {
    if (err) {
      res.status(500).send(err.message);
    } else {
          res.render("index", { files });
    }
  });
});

// Create Hisaab

app.get("/create", (req, res) => {
    res.render("create")
})


app.listen(3000, () => {
    console.log(`Port is listening on http://localhost:3000`)
})