const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const multer = require("multer");
const cors = require("cors");
const port = 8080;
const fs = require("fs");
const imageModel = require("./models");
const path = require('path');
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose
  .connect(
    "mongodb+srv://ayushvaish2511:abcdefghi@cluster0.kuyfwsr.mongodb.net/travel-backend?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("connected successfully"))
  .catch((err) => console.log("it has an error", err));


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '/uploads/'));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname);
  },
});
app.use(express.static(__dirname));

const upload = multer({ storage: storage });

app.post("/", upload.single("file"), (req, res) => {
  const saveImage =  imageModel({
    name: req.body.name,
    img: {
      data: fs.readFileSync("uploads/" + req.file.filename),
      contentType: "image/png",
    },
  });
  console.log(req.file);
  saveImage
    .save()
    .then((res) => {
      console.log("image is saved");
    })
    .catch((err) => {
      console.log(err, "error has occur");
    });
    res.send('image is saved')
});


app.get('/',async (req,res)=>{
  const allData = await imageModel.find()
  res.json(allData)
})

app.listen(port, () => {
  console.log("server running successfully");
});
