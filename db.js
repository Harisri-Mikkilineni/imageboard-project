const spicedPg = require("spiced-pg"); //open line of communication to database
const database = "imageboard";
const username = "postgres";
const password = "postgres";

//let's create our line of communication to the database
const db = spicedPg(
    process.env.DATABASE_URL ||
        `postgres:${username}:${password}@localhost:5432/${database}`
);

module.exports.getImages = () => {
    const q = "SELECT * FROM images ORDER BY id DESC LIMIT 8";
    return db.query(q);
};

module.exports.getImageById = (id) => {
    const q = "SELECT * FROM images WHERE id = $1";
    const params = [id];
    return db.query(q, params);
};

module.exports.addImages = (fileurl, username, title, description) => {
    const q = `INSERT INTO images (url, username, title, description) 
    VALUES($1, $2, $3, $4) RETURNING url, username, title, description, id`;
    const params = [fileurl, username, title, description];
    return db.query(q, params);
};

module.exports.getMoreImages = (lowestIdOnScreen) => {
    const q = `SELECT url, title, id ,(SELECT id
  FROM images
  ORDER BY id ASC
LIMIT 1) AS "lowestId" 
FROM images
WHERE id < $1
ORDER BY id DESC
LIMIT 8`;
    const params = [lowestIdOnScreen];
    return db.query(q, params);
};

module.exports.getComments = (image_id) => {
    const q = `SELECT * FROM comments WHERE image_id=$1`;
    const params = [image_id];
    return db.query(q, params);
};

module.exports.addComment = (image_id, username, comment_text) => {
    const q = `INSERT INTO comments(image_id,username,comment_text)
    VALUES($1,$2,$3) RETURNING image_id`;
    const params = [image_id, username, comment_text];
    return db.query(q, params);
};
