const config = require("./config.json");
const { expect } = require("chai");
const clickElement = async function (page, selector) {
  try {
    await page.waitForSelector(selector);
    await page.click(selector);
  } catch (error) {
    throw new Error(`Selector is not clickable: ${selector}`);
  }
};
const getText = async function (page, selector) {
  try {
    await page.waitForSelector(selector);
    return await page.$eval(selector, (element) => element.textContent);
  } catch (error) {
    throw new Error(`Text is not available for selector: ${selector}`);
  }
};
const getStartPage = function () { return config.startUrl };
const prepareSelector = function (selector, param) {
  return selector.replace(config.paramMark, param);
};
const clickSeanceDay = async function (page, day = 1) {
  let seanceDay = prepareSelector(config.selectors.seanceDay, day);
  await clickElement(page, seanceDay);
};
const clickSeanceTime = async function (page, time) {
  let timeBlock = await page.$x(`//a[text()='${time}']`);
  await timeBlock[0].click();
};
const takeChairs = async function (page, count = 1) {
  for (let i = 1; i <= count; i++) {
    await clickElement(page, config.selectors.freeChair);
  }
};
const booking = async function (page, times = 1) {
  for (let i = 1; i <= times; i++) {
    await clickElement(page, config.selectors.acceptBtn);
  }
};
const checkQRCode = async function (page) {
  let actual = await page.$eval(
    ".ticket__info-qr",
     img => img.getAttribute('src')
  );
  expect(actual).equal(config.QRsrc);
};
const checkCountBookedChairs = async function (page, count) {
  let chairsString = await getText(page, config.selectors.buyedChairs);
  expect(chairsString.split(',').length).equal(count);
};
const prepareForSadTest = async function (page, day, time) {
  await clickSeanceDay(page, day);
  await clickSeanceTime(page, time);
  await takeAllChairs(page);
  // для того, чтобы места отметились как занятые,
  // необходимо  раза нажать на забронировать
  await booking(page, 2);
  await page.goto(getStartPage());
};
const takeAllChairs = async function (page) {
  await page.waitForSelector(config.selectors.freeChair);
  await page.$$eval(
    config.selectors.freeChair,
    chairs => chairs.forEach(el => el.click())
  );
};
const checkAllChairsAreTaken = async function (page) {
  await page.waitForSelector(config.selectors.takenChair);
  const countFreeChairs = await page.$$eval(
    config.selectors.freeChair,
    chairs => chairs.length
  );
  expect(countFreeChairs).equal(0);
};
module.exports = {
  getStartPage: getStartPage,
  clickSeanceDay: clickSeanceDay,
  clickSeanceTime: clickSeanceTime,
  takeChairs: takeChairs,
  booking: booking,
  checkQRCode: checkQRCode,
  checkCountBookedChairs: checkCountBookedChairs,
  prepareForSadTest: prepareForSadTest,
  checkAllChairsAreTaken: checkAllChairsAreTaken
};