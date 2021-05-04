const puppeteer = require('puppeteer');

async function scrapeData(url) {
	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	await page.goto(url);

	/* scrape table data */
	const tableData = await page.evaluate(() => {
		const rows = document.querySelectorAll('table tr');
		const ths = document.querySelectorAll('table tr th');

		let rowData = {};

		/* make identical 'th's an array */
		let lastHeadTxt1 = '';
		ths.forEach((th) => {
			const innTxt = th.innerText;
			if (lastHeadTxt1 === innTxt && !Array.isArray(rowData[innTxt])) {
				rowData[innTxt] = [];
			}

			lastHeadTxt1 = innTxt;
		});

		/* get key value pairs */
		let lastHeadTxt2 = '';
		rows.forEach((row) => {
			const th = row.querySelector('th');
			const td = row.querySelector('td');

			if (th && td) {
				const key = th.innerText;

				if (Array.isArray(rowData[key])) {
					rowData[key].push(td.innerText);
				} else {
					rowData[key] = td.innerText;
				}
			} else if (th && !td) {
				if (th.innerText === '付属品名') {
					lastHeadTxt2 = '付属品名';
					rowData[lastHeadTxt2] = [];
				} else if (th.innerText === '付属ソフト名') {
					lastHeadTxt2 = '付属ソフト名';
					rowData[lastHeadTxt2] = [];
				} else {
					const key = th.innerText;
					rowData[key] = '';
				}
			} else if (!th && td) {
				rowData[lastHeadTxt2].push(td.innerText);
			}
		});

		/* get left-out 'th's of a row */
		ths.forEach((th) => {
			if (!(th.innerText in rowData)) {
				rowData[th.innerText] = '';
			}
		});

		return rowData;
	});

	console.log(tableData);

	await browser.close();
}

scrapeData(
	'https://www.inversenet.co.jp/pclist/product/CASIO/MPC%252D225BL.html'
);
