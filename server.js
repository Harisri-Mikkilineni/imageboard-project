const express = require("express");

const app = express();
const db = require("./db");
const { uploader } = require("./upload");
const s3 = require("./s3");
const moment = require("moment");

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
            res.json({ image: rows[0] });
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

app.get("/selectedimage/:id", (req, res) => {
    db.getImageById(req.params.id)
        .then(({ rows }) => {
            rows.forEach(function (row) {
                row.created_at = moment(row.created_at).format(
                    "MMMM Do YYYY, h:mm:ss a"
                );
                console.log("created at:", row.created_at);
            });
            console.log("Image info:", rows[0]);
            res.json(rows[0]);
            // console.log("Get image by id:", imageInfo);
        })
        .catch((err) => console.log("err in getting image by id:", err));
});

app.get("/getmoreimages/:lowestIdOnScreen", (req, res) => {
    console.log("params:", req.params);
    db.getMoreImages(req.params.lowestIdOnScreen)
        .then(({ rows }) => {
            res.json(rows);
            console.log("more rows:", rows);
        })
        .catch((err) => console.log("err in getting more images:", err));
});

app.get("/comments/:imageId", (req, res) => {
    console.log("params:", req.params.imageId);
    db.getComments(req.params.imageId)
        .then(({ rows }) => {
            rows.forEach(function (row) {
                row.created_at = moment(row.created_at).format(
                    "MMMM Do YYYY, h:mm:ss a"
                );
                console.log("created at:", row.created_at);
            });

            console.log("comments:", rows);
            res.json(rows);
        })
        .catch((err) => console.log("err in getting comments:", err));
});

app.post("/comment", (req, res) => {
    console.log("req.body:", req.body);
    const { image_id, username, comment_text } = req.body;
    db.addComment(image_id, username, comment_text)
        .then(({ rows }) => {
            rows.forEach(function (row) {
                row.created_at = moment(row.created_at).format(
                    "MMMM Do YYYY, h:mm:ss a"
                );
                console.log("created at:", row.created_at);
            });
            console.log("comment added into db:", rows);
            res.json({ comment: rows[0] });
        })
        .catch((err) => {
            console.log("error in adding comments to db:", err);
        });
});

app.get("*", (req, res) => {
    res.sendFile(`${__dirname}/index.html`);
});

app.listen(8080, () => console.log(`I'm listening.`));
