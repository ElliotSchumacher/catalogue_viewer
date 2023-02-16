const express = require("express");
const { scrapeCatalogue } = require("./utils/scraper");
require('dotenv').config();

const app = express();
const HOST = process.env.HOST || "http://localhost";
const PORT = process.env.PORT || 8000;

app.set("view engine", "ejs");

app.get("/", async (req, res) => {
    try {
        let catalogue = await scrapeCatalogue();
        const regex = new RegExp(/designer.s.*choice/, "i");
        catalogue = catalogue.filter(product => !regex.test(product.name));
        catalogue.sort((a, b) => {
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
        res.render("index", { catalogue, HOST, PORT });
    } catch (error) {
        res.status(500).send(error);
    }
});

app.get("/image", (req, res) => {
    const { image, name } = req.query;
    if (!image || !name) {
        res.status(400).send("Missing image or name query parameter.");
    } else {
        res.render("image", { image, name });
    }
});

app.get("/test", (req, res) => {
    res.send("Hello World!");
});

/* -------------------  Public Port  ------------------- */
app.use(express.static("public"));
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});