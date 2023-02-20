const axios = require("axios");
const cheerio = require("cheerio");

exports.scrapeCatalogue = async () => {
    try {
        let $ = await loadPageDOM(1);
        const totalProductCount = parseInt($("span.pagination-page_count").text().trim().split(" ").pop());
        const rawProducts = $("div.item-wrapper"); 
        const productsPerPage = rawProducts.length;
        const productPages = Math.ceil(totalProductCount / productsPerPage);
        const catalogue = [];
        extractData(catalogue, rawProducts, $);

        const pageParameters = [];
        for (let page = 2; page <= productPages; page++) {
            pageParameters.push(page);
        }
        await Promise.all(pageParameters.map((page) => scrapePage(page, catalogue)));
        if (catalogue.length !== totalProductCount) {
            console.log(catalogue);
            console.log(`catalogueLength: ${catalogue.length}, totalProductCount: ${totalProductCount}`);
            throw new Error("Catalogue length does not match total product count.");
        }
        return catalogue;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

async function loadPageDOM(page) {
    const { data } = await axios.get("https://lavassar.com/seattle-florist-flower-delivery/?p=" + page);
    const $ = await cheerio.load(data);
    return $;
}

function extractData(catalogue, rawProducts, $) {
    rawProducts.each((i, el) => {
        const image = $(el).find("img.item-img").attr("src");
        const name = $(el).find("span.itemInfo-name--desktop").text().trim();
        const price = parseFloat($(el).find("span.itemInfo-price").text().trim().substring(1)); // Remove dollar sign
        catalogue.push({ image, name, price });
    });
}

async function scrapePage(parameter, catalogue) {
    const $ = await loadPageDOM(parameter);
    const rawProducts = $("div.item-wrapper");
    extractData(catalogue, rawProducts, $);
}