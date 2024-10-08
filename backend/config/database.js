import mysql from "mysql2/promise";

// Database configuration
const dbConfig = {
  host: "localhost",
  user: "root",
  password: "",
  database: "beautydb",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  decimalNumbers: true,
};

// Create a connection pool
const pool = mysql.createPool(dbConfig);

// Export the pool for use in other modules
export default pool;
