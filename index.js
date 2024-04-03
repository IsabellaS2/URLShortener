import express from "express";
import { body, validationResult } from "express-validator";
import bodyParser from "body-parser";
import pg from "pg";
import env from "dotenv";

env.config();

const app = express();
const port = process.env.PORT;

// Configuring PostgreSQL client
const db = new pg.Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

//Generate Short Link
function generateShortLink() {
  const firstPart = Math.random().toString(36).substr(2, 3);
  const secondPart = Math.random().toString(36).substr(2, 3);
  return firstPart + secondPart;
}

//Validation Middleware
const validateInput = [body("fullUrlInput").isURL().withMessage("Invalid URL")];

//Routes
app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.post("/", validateInput, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render("emptyPage.ejs");
  }

  const longUrl = req.body.fullUrlInput;
  try {
    const checkLongUrlExists = await db.query(
      "SELECT short_url FROM urls WHERE long_url = $1",
      [longUrl]
    );

    // Check if long URL exists, if it does then return the short URL
    if (checkLongUrlExists.rows.length > 0) {
      const shortUrl = checkLongUrlExists.rows[0].short_url; //returns short url
      const fullShortUrl = `http://localhost:3000/${shortUrl}`;
      return res.render("urlExists.ejs", { fullShortUrl, shortUrl });
    } else {
      // If URL doesn't exist, add it to the database and generate a short URL
      const shortUrl = generateShortLink();
      await db.query("INSERT INTO urls (long_url, short_url) VALUES ($1, $2)", [
        longUrl,
        shortUrl,
      ]);
      const fullShortUrl = `http://localhost:3000/${shortUrl}`;
      return res.render("createNewUrl.ejs", { fullShortUrl, shortUrl });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send("Error retrieving long URL from database");
  }
});

//Route to handle what happens when the user clicks the short url
app.get("/:shortUrl", async (req, res) => {
  const shortUrl = req.params.shortUrl;
  try {
    const result = await db.query(
      "SELECT long_url FROM urls WHERE short_url = $1",
      [shortUrl]
    );
    if (result.rows.length > 0) {
      const longUrl = result.rows[0].long_url;
      res.redirect(longUrl);
    } else {
      res.status(404).render("emptyPage.ejs");
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Error retrieving long URL from database");
  }
});

// Starting the server and listening on the specified port
app.listen(port, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
