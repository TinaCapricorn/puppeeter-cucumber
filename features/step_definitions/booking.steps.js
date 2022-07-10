const puppeteer = require("puppeteer");
const { Given, When, Then, Before, After, setDefaultTimeout } = require("@cucumber/cucumber");
const {
  getStartPage,
  clickSeanceDay,
  clickSeanceTime,
  takeChairs,
  booking,
  checkQRCode,
  checkCountBookedChairs,
  prepareForSadTest,
  checkAllChairsAreTaken,
} = require("../../lib/commands.js");
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

Given("user is on {string}", async function (url) {
  await this.page.goto(url);
});

When("user booking {int} ticket at day {int} and time {string}", async function (count, day, time) {
  // выбираем день
  await clickSeanceDay(this.page, day);
  // выбираем сеанс
  await clickSeanceTime(this.page, time);
  // выбираем места
  await takeChairs(this.page, count);
  // бронируем
  // в данном случае нужно именно 2 раза нажать кнопку,
  // чтобы появился QR код
  await booking(this.page, 2);
});

Then("user see qr code", async function () {
  // проверяем наличие QR кода
 await checkQRCode(this.page);
});

Then("user see {int} places in booking data", async function (count) {
  // проверяем кол-во забронированных мест
  await checkCountBookedChairs(this.page, count);
});


When("all chairs are taken at day {int} and time {string}", async function (day, time) {
  // подготавливем условия для теста
  await prepareForSadTest(this.page, day, time); 
});
When("user try to booking ticket at day {int} and time {string}", async function (day, time) {
  // выбираем день
  await clickSeanceDay(this.page, day);
  // выбираем сеанс
  await clickSeanceTime(this.page, time); 
});

Then("user failed booking because all chairs are taken", async function () {
  // проверяем что все места заняты
  await checkAllChairsAreTaken(this.page);
});