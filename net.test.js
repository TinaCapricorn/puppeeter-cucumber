const { expect } = require("chai");
const { clickElement, getText } = require("./lib/commands.js");

let page;

beforeEach(async () => {
  page = await browser.newPage();
  await page.goto("http://qamid.tmweb.ru/client/index.php");
});

afterEach(() => {
  page.close();
});

describe("Booking tests", () => {
  test("Booking ticket", async () => {
    await clickElement(page, ".page-nav__day:nth-child(3)");
    await clickElement(page, ".movie-seances__time");
    await clickElement(page, ".buying-scheme__chair:not(.buying-scheme__chair_taken)");
    await clickElement(page, ".acceptin-button");
    await clickElement(page, ".acceptin-button");
    let actual = await page.$eval(".ticket__info-qr", img => img.getAttribute('src') );
    expect(actual).equal("i/QR_code.png");
  });
  test("Booking multiple tickets", async () => {
    await clickElement(page, ".page-nav__day:nth-child(4)");
    await clickElement(page, ".movie-seances__time");
    await clickElement(page, ".buying-scheme__chair:not(.buying-scheme__chair_taken,.buying-scheme__chair_selected)");
    await clickElement(page, ".buying-scheme__chair:not(.buying-scheme__chair_taken,.buying-scheme__chair_selected)");
    await clickElement(page, ".buying-scheme__chair:not(.buying-scheme__chair_taken,.buying-scheme__chair_selected)");
    await clickElement(page, ".acceptin-button");
    await clickElement(page, ".acceptin-button");
    let actual = await getText(page, ".ticket__chairs");
    expect(actual.split(',').length).equal(3);
  });
  test("Fail booking", async () => {
    await page.waitForSelector('.movie-seances__time');
    let actual = await page.$eval(".movie-seances__time", button => button.getAttribute("class"));
    expect(actual).contain("acceptin-button-disabled");
  });
});