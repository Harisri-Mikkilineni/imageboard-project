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
    const q = "SELECT * FROM images ORDER BY id DESC";
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
