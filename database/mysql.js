import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  waitForConnections: true,
});

async function executeQuery(query) {
  try {
    const db = await pool.getConnection();
    const [rows, fields] = await db.execute(query);
    db.release();
    return { rows: rows, fields: fields };
  } catch (error) {
    console.log({ error });
    return { error };
  }
}
export default executeQuery;
