const puppeteer = require('puppeteer');

async function scrapeData(url) {
	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	await page.goto(url);

	/* scrape table data */
	const tableData = await page.evaluate(() => {
		const rows = document.querySelectorAll(
			'#productDetails_techSpec_section_1 tr'
		);

		let rowData = {};
		rows.forEach((row) => {
			const th = row.querySelector('th');
			const td = row.querySelector('td');

			const key = th.innerText.replace(/\s+/g, '_').toLowerCase();
			rowData[key] = td.innerText;
		});

		return rowData;
	});

	console.log(tableData);

	await browser.close();
}

scrapeData(
	'https://www.amazon.com/Razer-Huntsman-Elite-Opto-Mechanical-Multi-Functional/dp/B07DHNX18W/'
);
