import { useEffect, useState } from 'react'
import { api } from '../../../api-config/api'

interface QuoteType {
  quote: string
  author: string
}

const QuoteContainer = () => {
  const [quote, setQuote] = useState<QuoteType | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        const response = await api.get('/quotes/quoteOfTheDay')
        if (response.data?.quote) {
          setQuote(response.data.quote)
        }
      } catch (error) {
        console.error('Error fetching quote of the day:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchQuote()
  }, [])

  return (
    <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-5 w-full h-full flex flex-col items-center gap-4 sm:gap-6 justify-center">
      <div className="shrink-0 text-left border-b sm:border-b-0 sm:border-r border-slate-100 pb-4 sm:pb-0 sm:pr-6">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
          Daily Motivation
        </span>
        <h2 className="text-lg font-bold text-slate-800 mt-2">
          Quote of the Day
        </h2>
      </div>

      <div className="flex-1 text-center sm:text-left">
        {loading ? (
          <div className="h-12 flex items-center justify-center sm:justify-start text-slate-400 text-sm italic">
            Loading quote...
          </div>
        ) : quote ? (
          <figure>
            <blockquote className="text-base sm:text-lg font-medium text-slate-700 italic">
              “{quote.quote}”
            </blockquote>
            <figcaption className="mt-2 text-sm font-semibold text-blue-600">
              — {quote.author || 'Unknown'}
            </figcaption>
          </figure>
        ) : (
          <p className="text-slate-500 italic text-sm">
            “Success is the sum of small efforts, repeated day in and day out.”
          </p>
        )}
      </div>
    </div>
  )
}

export default QuoteContainer
