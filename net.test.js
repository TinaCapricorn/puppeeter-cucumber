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
} = require("./lib/commands.js");

let page;

beforeEach(async function () {
  page = await browser.newPage();
  await page.goto(getStartPage());
});

afterEach(() => {
  page.close();
});

describe("Booking tests", () => {
  test("Booking ticket", async () => {
    // выбираем день
    await clickSeanceDay(page, 3);
    // выбираем сеанс
    await clickSeanceTime(page);
    // выбираем места
    await takeChairs(page);
    // бронируем
    // в данном случае нужно именно 2 раза нажать кнопку,
    // чтобы появился QR код
    await booking(page, 2);
    // проверяем наличие QR кода
    await checkQRCode(page);
  });
  test("Booking multiple tickets", async () => {
    // кол-во мест, которые будем бронировать
    let count = 3;
    // выбираем день
    await clickSeanceDay(page, 2);
    // выбираем сеанс
    await clickSeanceTime(page);
    // выбираем места
    await takeChairs(page, count);
    // бронируем
    await booking(page);
    // проверяем кол-во забронированных мест
    await checkCountBookedChairs(page, count);
  });
  test("Fail booking, because all chairs are taken", async () => {
      let day = 4;
      // подготавливем условия для теста
      await prepareForSadTest(page, day);
      // выбираем день
      await clickSeanceDay(page, day);
      // выбираем сеанс
      await clickSeanceTime(page);
      // проверяем что все места заняты
      await checkAllChairsAreTaken(page);
  });
});