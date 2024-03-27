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
    const checkUrlExists = await db.query(
      "SELECT short_url FROM urls WHERE long_url = $1",
      [longUrl]
    );

    // Check if long URL exists, if it does then return the short URL
    if (checkUrlExists.rows.length > 0) {
      const shortUrl = checkUrlExists.rows[0].short_url; //returns short url
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
app.get("/", (req, res) => {
  res.send("yay short url");
});

// app.get("/:shortUrl", async (req, res) => {
//    const shortUrl = req.params.shortUrl;
//    // Lookup the long URL based on the short URL from the database
//    const longUrl = await lookupLongUrl(shortUrl); // Implement this function to retrieve the long URL

//    if (longUrl) {
//        // Redirect the user to the long URL
//        res.redirect(longUrl);
//    } else {
//        res.status(404).send("Short URL not found");
//    }
// });

// Starting the server and listening on the specified port
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
