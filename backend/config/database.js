import mysql from "mysql";

//connection till databas.
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "123",
    database: "beautydb",
})

export default db;