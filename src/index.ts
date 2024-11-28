import express, { Request, Response } from "express";
import { RequestBody } from "./types";
import { pool } from "./db/db";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT: number = 3000;
app.use(express.json());

app.get("/test", (req: Request, res: Response) => {
  console.log('hello world 1');
  res.send('hello world 1')
});

app.get("/", async (req: Request, res: Response) => {
  try {
    const result = await pool.query("SELECT * FROM users");

    res.status(200).json({ users: result.rows });
  } catch (error) {
    console.error("error!", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/", async (req: Request, res: Response) => {
  const { name, email }: RequestBody = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO users(name, email) VALUES ($1, $2) RETURNING name, email",
      [name, email]
    );

    res.status(200).json({ name, email });
  } catch (error) {
    console.error("error during insert:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/setup", async (req, res) => {
  try {
    await pool.query(
      "CREATE TABLE users(id SERIAL PRIMARY KEY, name TEXT, email TEXT)"
    );
    res.status(200).json({ message: "table created successfully!" });
  } catch (error) {
    console.error("something went wrong", error);
  }
});

app.listen(PORT, async () => {
  console.log(`listening on ${PORT} 4`);
});
