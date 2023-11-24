require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

const dbClient = require("./database/postgres.database");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  }),
);

// test connection to db
app.get("/test", async (req, res) => {
  await dbClient.connect((err) => {
    console.log(err);
    res.send(err);
  });
  const result = await dbClient.query("SELECT NOW()");
  await dbClient.end();
  res.send(result.rows[0]);
});

const apiRouter = require("./controllers/app.controllers");
app.use("/api", apiRouter);

const authRouter = require("./controllers/auth.controllers");
app.use("/auth", authRouter);

app.listen(process.env.SERVER_PORT || 3000, () => {
  console.log(`Server is running on port ${process.env.SERVER_PORT || 3000}`);
  dbClient.openConnection();
});
