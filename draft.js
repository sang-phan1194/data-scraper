const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const fs = require('fs');

async function scrapeData() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://www.formula1.com/en/drivers.html');
  const content = await page.content();
  const $ = cheerio.load(content);
  const raceResults = [];

  $('a.listing-item--link').each((index, element) => {
    const firstName = $(element).find('span.d-block.f1--xxs.f1-color--carbonBlack').text();
    const team = $(element).find('span.d-block.f1-bold--s.f1-color--carbonBlack').text();
    const point = $(element).find('div.f1-wide--s').text();
    const rank = $(element).find('div.rank').text();
    const profileImg = $(element).find('div.listing-item--image-wrapper.f1-pattern-fill > picture.listing-item--photo > img').attr('data-src');
    const nationImg = $(element).find('div.container > div > div.col-xs-4.country-flag > picture > img').attr('data-src');

    raceResults.push({ index, firstName, point, rank, team, nationImg, profileImg });
  });


  const jsonData = JSON.stringify(raceResults, null, 2);

  fs.writeFile('/Users/urak/Desktop/Workspace/drivers.json', jsonData, 'utf8', (err) => {
    if (err) {
      console.error('Error writing JSON file:', err);
    } else {
      console.log('JSON file has been saved.');
    }
  });
  await browser.close();
}


scrapeData();
