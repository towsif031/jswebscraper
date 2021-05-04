const puppeteer = require('puppeteer');

async function scrapeData(url) {
	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	await page.goto(url);

	/* scrape table data */
	const tableData = await page.evaluate(() => {
		const rows = document.querySelectorAll('table tr');

		let rowData = {};
		let lastTh = '';

		rows.forEach((row) => {
			const th = row.querySelector('th');
			const td = row.querySelector('td');

			if (th && td) {
				const key = th.innerText;
				rowData[key] = td.innerText;
			} else if (th && !td) {
				if (th.innerText === '付属品名') {
					lastTh = '付属品名';
					rowData[lastTh] = [];
				} else if (th.innerText === '付属ソフト名') {
					lastTh = '付属ソフト名';
					rowData[lastTh] = [];
				} else {
					const key = th.innerText;
					rowData[key] = '';
				}
			} else if (!th && td) {
				rowData[lastTh].push(td.innerText);
			}
		});

		return rowData;
	});

	console.log(tableData);

	await browser.close();
}

scrapeData(
	'https://www.inversenet.co.jp/pclist/product/ASUS/X75VD%252DTY096V.html'
);

// scrapeData(
// 	'https://www.inversenet.co.jp/pclist/product/CASIO/MPC%252D225BL.html'
// );
