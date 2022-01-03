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
    const q = "SELECT * FROM images";
    return db.query(q);
};
