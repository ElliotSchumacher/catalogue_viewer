const e = require("express");
const express = require("express"); //npm install express
const { scrapeCatalogue } = require("./utils/scraper");
require('dotenv').config();

const app = express();
app.set("view engine", "ejs");

app.get("/", async (req, res) => {
    try {
        const catalogue = await scrapeCatalogue();
        const sortedCatalogue = catalogue.sort((a, b) => {
            const nameA = a.name.toUpperCase();
            const nameB = b.name.toUpperCase();
            if (nameA < nameB) {
                return -1;
            } else if (nameA > nameB) {
                return 1;
            } else {
                return 0;
            }
        });
        res.render("index", { catalogue });
    } catch (error) {
        res.status(500).send(error);
    }
});

/* -------------------  Public Port  ------------------- */
app.use(express.static("public"));
const PORT = process.env.PORT || 8000;
app.listen(PORT);