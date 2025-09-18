import { useEffect, useState } from "react";
import axios from 'axios';

interface quoteType {
    quote: string;
    author: string;
}
const QuoteContainer = () => {
    const [quote, setQuote] = useState<quoteType | null>(null);
    useEffect(() => {
        const fetchQuote = async () => {
            try {
                const response = await axios.get('http://localhost:8000/quotes/quoteOfTheDay');
                console.log("Data", response.data.quote)
                setQuote(response.data.quote);
            } catch (error) {
                console.error('Error fetching quote:', error);
            }
        }
        fetchQuote();
    }, [])

    return (
        <div className="flex flex-row gap-4 px-2 py-4 md:w-200 rounded-2xl shadow max-w-2xl mx-auto">
            <div className="text-xl w-40 font-semibold text-transparent bg-clip-text bg-gradient-to-t from-blue-500 to-orange-500">
                <h1 className="flex text-wrap">Quote of <br /> the day</h1>
            </div>
            <h1 className="font-3xl text-transparent bg-clip-text bg-amber-900"> :: </h1>
            <div className="">
                <blockquote className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-orange-500">
                    “{quote?.quote}”
                </blockquote>
                <footer className="mt-1 text-right text-md font-medium text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-orange-500">
                    — {quote?.author}
                </footer>
            </div>
        </div>
    );
};

export default QuoteContainer;
