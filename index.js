import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

// Configuring PostgreSQL client
const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "URL",
  password: "Sg4eM?@9n",
  port: 5432,
});

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("home.ejs");
});

//Generate Short Link
function generateShortLink() {
  var firstPart = (Math.random() * 46656) | 0;
  var secondPart = (Math.random() * 46656) | 0;
  firstPart = ("000" + firstPart.toString(36)).slice(-3);
  secondPart = ("000" + secondPart.toString(36)).slice(-3);
  return firstPart + secondPart;
}

app.post("/", async (req, res) => {
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
      res.send(
        `URL already exists. Short URL: <a href="${fullShortUrl}">${shortUrl}</a>`
      );
    } else {
      // If URL doesn't exist, add it to the database and generate a short URL
      const shortUrl = generateShortLink();
      await db.query("INSERT INTO urls (long_url, short_url) VALUES ($1, $2)", [
        longUrl,
        shortUrl,
      ]);
      const fullShortUrl = `http://localhost:3000/${shortUrl}`;
      res.send(`Short URL created: <a href="${fullShortUrl}">${shortUrl}</a>`);
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Error retrieving long URL from database");
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
      res.status(404).send("Short URL not found");
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Error retrieving long URL from database");
  }
});

// Starting the server and listening on the specified port
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
