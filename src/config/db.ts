import { Database } from "sqlite3";
import path from "path";

const dbPath = path.resolve(__dirname + "../../../data/database.sqlite");
const db = new Database(dbPath, (err) => {
  if (err) {
    console.log("Could not connect to the database", err);
  } else {
    console.log("Connected to the SQLite database");
  }
});

export default db;
