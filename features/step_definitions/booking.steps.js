const puppeteer = require("puppeteer");
const chai = require("chai");
const expect = chai.expect;
const { Given, When, Then, Before, After, setDefaultTimeout } = require("@cucumber/cucumber");
const { clickElement, getText } = require("../../lib/commands.js");
setDefaultTimeout(15000);

Before(async function () {
  const browser = await puppeteer.launch({ headless: false, slowMo: 50 });
  const page = await browser.newPage();
  this.browser = browser;
  this.page = page;
});

After(async function () {
    await this.browser.close();
});

Given("user is on page", async function () {
  return await this.page.goto("http://qamid.tmweb.ru/client/index.php");
});

When("user booking 1 ticket", async function () {
  await clickElement(this.page, ".page-nav__day:nth-child(3)");
  await clickElement(this.page, ".movie-seances__time");
  await clickElement(this.page, ".buying-scheme__chair:not(.buying-scheme__chair_taken)");
  await clickElement(this.page, ".acceptin-button");
  return await clickElement(this.page, ".acceptin-button");
});

Then("user see qr code", async function () {
  let actual = await this.page.$eval(".ticket__info-qr", img => img.getAttribute('src') );
  expect(actual).equal("i/QR_code.png");
});

When("user booking 3 ticket", async function () {
  await clickElement(this.page, ".page-nav__day:nth-child(4)");
  await clickElement(this.page, ".movie-seances__time");
  await clickElement(this.page, ".buying-scheme__chair:not(.buying-scheme__chair_taken,.buying-scheme__chair_selected)");
  await clickElement(this.page, ".buying-scheme__chair:not(.buying-scheme__chair_taken,.buying-scheme__chair_selected)");
  await clickElement(this.page, ".buying-scheme__chair:not(.buying-scheme__chair_taken,.buying-scheme__chair_selected)");
  await clickElement(this.page, ".acceptin-button");
  return await clickElement(this.page, ".acceptin-button");
});

Then("user see 3 places in booking data", async function () {
  let actual = await getText(this.page, ".ticket__chairs");
  expect(actual.split(',').length).equal(3);
});

When("user try to booking ticket on disabled time", async function () {
  return await this.page.waitForSelector('.movie-seances__time');
});

Then("user failed booking", async function () {
  let actual = await this.page.$eval(".movie-seances__time", button => button.getAttribute("class"));
  expect(actual).contain("acceptin-button-disabled");
});