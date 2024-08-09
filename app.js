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


app.get("/create", (req, res) => {
    res.render("create")
})


// create hisaab file
/* 
app.post("/new", (req, res) => {

    const currentDate = new Date();
    const date = `${currentDate.getDate()}-${
      currentDate.getMonth() + 1
    }-${currentDate.getFullYear()}`;

    fs.writeFile(`./files/${date}.txt`, req.body.data, (err) => {
        if (err) return res.status(500).send(err);
        res.redirect("/")
    })
})
*/

// Create hisaab file with existing name and append counter

app.post('/new', (req, res) => {
  const currentDate = new Date();
  const date = `${currentDate.getDate()}-${
    currentDate.getMonth() + 1
  }-${currentDate.getFullYear()}`;
  let fileName = `${date}.txt`;
  let filePath = path.join(__dirname, 'files', fileName);

  // Check if the file exists and increment the filename if it does
  let counter = 1;
  while (fs.existsSync(filePath)) {
    fileName = `${date}(${counter}).txt`;
    filePath = path.join(__dirname, 'files', fileName);
    counter++;
  }

  // Write the file
  fs.writeFile(filePath, req.body.data, (err) => {
    if (err) return res.status(500).send(err);
    res.redirect('/');
  });
});

// Read hisaab
app.get("/files/:filename", (req, res) => {
  const filename = req.params.filename;
  fs.readFile(`./files/${filename}`, "utf-8", function (err, data) {
    if (err) {
      res.status(500).send(err.message);
    } else {
      res.render("hisaab", { data, filename });
    }
  });
});

// Edit page
app.get('/edit/:filename', (req, res) => {
  const filename = req.params.filename;
  fs.readFile(`./files/${filename}`, 'utf-8', (err, data) => {
    if (err) {
      res.status(500).send(err.message);
    } else {
      res.render('edit', { filename, data });
    }
  });
});

// Update hisaab
app.post("/update/:filename", (req, res) => {
  const filename = req.params.filename;
  fs.writeFile(`./files/${filename}`, req.body.fileData, (err) => {
    if (err) {
      res.status(500).send(err.message);
    } else {
      res.redirect("/")
    }
  });
})

// Delete hisaab
app.get("/delete/:filename", (req,res) => {
  const filename = req.params.filename;
  fs.unlink(`./files/${filename}`, (err) => {
    if (err) return res.status(500).send(err.message);
    res.redirect("/");
  })
} )


app.listen(3000, () => {
    console.log(`Port is listening on http://localhost:3000`)
})