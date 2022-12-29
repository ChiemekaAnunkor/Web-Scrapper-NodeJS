const puppeteer = require("puppeteer");
const cron = require("node-cron");

const fs = require("fs/promises");
const { info } = require("console");
const { start } = require("repl");
const { resourceLimits } = require("worker_threads");
async function scrape() {
  const browser = await puppeteer.launch();

  const page = await browser.newPage();
  await page.goto("https://learnwebcode.github.io/practice-requests/");
  // await page.screenshot({ path: "amazing.png", fullPage: true }); //  screen shots

  const names = await page.evaluate(() => {
    return Array.from(document.querySelectorAll(".info strong")).map(
      (x) => x.textContent
    );
  });

  await fs.writeFile("names.txt", names.join("\r\n")); // return and new line

  await page.click("#clickme");
  const clickedData = await page.$eval("#data", (el) => el.textContent);

  await page.type("#ourfield", "blue");
  // make sure they they both run before you get the data, with out bugs
  await Promise.all([page.click("#ourform button"), page.waitForNavigation()]);

  const inf0 = await page.$eval("#message", (el) => el.textContent);
  console.log(inf0);

  console.log(clickedData);
  const photos = await page.$$eval("img", (imgs) => {
    return imgs.map((x) => x.src);
  });

  for (const photo of photos) {
    const imagePage = await page.goto(photo);
    await fs.writeFile(photo.split("/").pop(), await imagePage.buffer());
  }

  await browser.close();
}

// scrape();
// run app every 5000 ms
// setInterval(scrape, 5000);

cron.schedule("*/5 * * * * *", start); //using node-cron

// LAST STEP: look up cront tab  to find away to run it in windows/ linux

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto("https://quotes.toscrape.com/");

  const grabQuotes = await page.evaluate(() => {
    const quotes = document.querySelectorAll(".quote");
    let quotesArr = [];
    quotes.forEach((quoteTag) => {
      const quoteInfo = quoteTag.querySelectorAll("span");
      const actualQuote = quoteInfo[0];
      const actualAuthor = quoteInfo[1].querySelector("small");

      quotesArr.push({
        quote: actualQuote.innerText,
        author: actualAuthor.innerText,
      });
    });
    return quotesArr;
  });

  console.log(grabQuotes);
  await browser.close();
})();

async function findAll(city) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto("https://www.google.com/");

  await page.type(".gLFyf", `things to do in ${city}`);

  await Promise.all([page.keyboard.press("Enter"), page.waitForNavigation()]);
  //   await page.waitForSelector(allThingsToDo);
  //   await page.click();
  await Promise.all([page.click(".FinaEf"), page.waitForNavigation()]);

  const data = await page.evaluate(() => {
    const thingstodo = document.querySelectorAll(".rqTuzc ");
    let dataArr = [];

    const titals = document.querySelectorAll(".GwjAi");
    titals.forEach((el) => {
      const each = el.querySelectorAll(".skFvHc");

      dataArr.push({ name: each[0].textContent });
    });
    // const imgs = document.querySelectorAll(".eJukS img");
    // imgs.forEach((el) => dataArr.push({ imgs: el.src }));

    return dataArr;
  });

  console.log(data);
  await browser.close();
}

// console.log(findAll("austin"));

const str = "";


console.log(str.split(""));
if (str) {
  console.log("worked");
}
