const puppeteer = require('puppeteer');

async function scrapeData(url) {
	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	await page.goto(url);

	/* img */
	const [el1] = await page.$x('//*[@id="landingImage"]');
	const imgSrc = await el1.getProperty('src');
	const img = await imgSrc.jsonValue();

	/* title */
	const [el2] = await page.$x('//*[@id="productTitle"]');
	const titleText = await el2.getProperty('textContent');
	const rawTitle = await titleText.jsonValue();
	const title = rawTitle.replace(/\r?\n|\r/g, '');

	/* price */
	const [el3] = await page.$x('//*[@id="priceblock_ourprice"]');
	const priceTxt = await el3.getProperty('textContent');
	const price = await priceTxt.jsonValue();

	console.log({ img, title, price });

	await browser.close();
}

scrapeData(
	'https://www.amazon.com/Razer-Huntsman-Elite-Opto-Mechanical-Multi-Functional/dp/B07DHNX18W/'
);
