import { createPool } from "mysql2";

const pool = createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
  connectionLimit: 10, // Limit concurrent connections
});

pool.getConnection((err, conn) => {
  if (err) console.log("Error connecting to db...");
  else console.log("Connected to db...!");
  conn.release();
});

const executeQuery = (query: string, arrParams: any[]) => {
  return new Promise((resolve, reject) => {
    try {
      pool.query(query, arrParams, (err, data) => {
        if (err) {
          console.log("Error in executing the query");
          reject(err);
        }
        console.log("------db.jsx------");
        //console.log(data)
        resolve(data);
      });
    } catch (err) {
      reject(err);
    }
  });
};

export default executeQuery;
