import axios from 'axios';
import express from 'express';
const Router = express.Router();

let cachedQuote = null;
let lastCachedDate = ''; // will store date as "Fri Aug 30 2025"

Router.get('/quoteOfTheDay', async (req, res) => {
    try {
        const today = new Date().toDateString();

        // Fetch new quote if not cached or it's a new day
        if (cachedQuote === null || lastCachedDate !== today) {
            const response = await axios.get("https://quotes-api-self.vercel.app/quote");

            if (!response.data) {
                return res.status(400).json({ error: 'Failed to fetch quote' });
            }

            cachedQuote = response.data;
            lastCachedDate = today;
        }

        return res.json({ quote: cachedQuote });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});


export default Router;