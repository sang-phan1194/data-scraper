const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const fs = require('fs');

async function scrapeData() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://www.formula1.com/en/results.html/2021/drivers.html');
  const content = await page.content();
  const $ = cheerio.load(content);
  const raceResults = [];

  $('tbody > tr').each((index, element) => {
    let position = $(element).find('td:nth-child(2)').text().trim().replace(/\s+/g, ' ');
    let driver = $(element).find('td:nth-child(3)').text().trim().replace(/\s+/g, ' ');
    let nationality = $(element).find('td:nth-child(4)').text().trim().replace(/\s+/g, ' ');
    let car = $(element).find('td:nth-child(5)').text().trim().replace(/\s+/g, ' ');
    let pts = $(element).find('td:nth-child(6)').text().trim().replace(/\s+/g, ' ')

    raceResults.push({ index, position, driver, nationality, car, pts });
  });

  console.log(raceResults);

  const jsonData = JSON.stringify(raceResults, null, 2);

  fs.writeFile('/Users/urak/Desktop/Workspace/2021-drivers.json', jsonData, 'utf8', (err) => {
    if (err) {
      console.error('Error writing JSON file:', err);
    } else {
      console.log('JSON file has been saved.');
    }
  });
  await browser.close();
}


scrapeData();
