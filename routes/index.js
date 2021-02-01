var express = require('express');
var router = express.Router();
const axios = require("axios");
const cheerio = require("cheerio");

/* GET home page. */
router.get('/', async function(req, res, next) {
    let ulList = [];
    const cnbc  = await axios.get("https://www.cnbc.com/world/?region=world");
    let $ = cheerio.load(cnbc.data);
    let $bodyList = $("div.RiverPlus-riverPlusContainer").children("div");
    $bodyList.each(function(i, elem) {
        ulList.push({
            title: $(this).find('.RiverHeadline-headline a').text(),
            url: $(this).find('.RiverHeadline-headline a').attr('href'),
            from: 'CNBC'
        })
    });

    const reuters  = await axios.get("https://www.reuters.com/theWire");
    $ = cheerio.load(reuters.data);
    $bodyList = $("div.news-headline-list").children("article");
    $bodyList.each(function(i, elem) {
        ulList.push({
            title: $(this).find('.story-content a').text(),
            url: "https://www.reuters.com/"+$(this).find('.story-content a').attr('href'),
            from: 'reuters'
        })
    });

    const data = ulList.filter(n => n.title);
    res.render('index', { title: `news feed` , data});
});

module.exports = router;
