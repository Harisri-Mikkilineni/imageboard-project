const express = require("express");

const app = express();
const db = require("./db");
const { uploader } = require("./upload");
const s3 = require("./s3");

app.use(express.static("./public"));

app.use(express.json());

app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
    console.log("req.body:", req.body);
    console.log("req.file:", req.file);

    const { username, title, description } = req.body;
    const { filename } = req.file;
    const fileurl = "https://spicedling.s3.amazonaws.com/" + filename;

    console.log("username:", req.body.username);
    console.log("title:", req.body.title);
    console.log("description:", req.body.description);
    console.log("fileurl:", fileurl);

    db.addImages(fileurl, username, title, description)
        .then(({ rows }) => {
            console.log("images added into db:", rows);
            res.json(rows);
        })
        .catch((err) => {
            console.log("error in adding images to db:", err);
        });
});

app.get("/images", (req, res) => {
    db.getImages()
        .then(({ rows }) => {
            res.json(rows);
            //console.log("rows:", rows);
        })
        .catch((err) => console.log("err in getting images:", err));
});

app.get("*", (req, res) => {
    res.sendFile(`${__dirname}/index.html`);
});

app.listen(8080, () => console.log(`I'm listening.`));
