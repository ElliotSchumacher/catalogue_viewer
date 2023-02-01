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
        scrapePage(catalogue, rawProducts, $);
        for (let page = 2; page <= productPages; page++) {
            $ = await loadPageDOM(page);
            const rawProducts = $("div.item-wrapper");
            scrapePage(catalogue, rawProducts, $);
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

function scrapePage(catalogue, rawProducts, $) {
    rawProducts.each((i, el) => {
        const image = $(el).find("img.item-img").attr("src");
        const name = $(el).find("span.itemInfo-name--desktop").text().trim();
        catalogue.push({ image, name });
    });
}