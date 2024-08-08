const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.post('/check', async (req, res) => {
    const productUrl = req.body.url;

    try {
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        await page.goto(productUrl, { waitUntil: 'networkidle2' });

        const isInStock = await page.evaluate(() => {
            const url = window.location.href;

            if (url.includes('amazon.in')) {
                const inStockElement = document.querySelector('#availability > span');
                return inStockElement && inStockElement.textContent.includes('In stock');
            } else if (url.includes('flipkart.com')) {
                const outOfStockElement = document.querySelector('.Z8JjpR');
                return !outOfStockElement;
            } else if (url.includes('ajio.com')) {
                const sizeElements = document.querySelectorAll('.size-variant-item');
                return Array.from(sizeElements).some(el => el.classList.contains('size-instock'));
            }

            return false;
        });

        await browser.close();
        res.json({ inStock: isInStock });
    } catch (error) {
        console.error('Error checking product availability:', error);
        res.status(500).json({ inStock: false, message: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
