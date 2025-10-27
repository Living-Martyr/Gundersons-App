
import React, { useState, useEffect } from 'react';
import { fetchFinancialData } from '../services/financialService';
import { fetchNewsWithGemini } from '../services/geminiService';
import type { FinancialData, NewsArticle } from '../types';
import { ArrowTrendingUpIcon, NewspaperIcon } from './icons';

interface StockNewsAndQuoteProps {
  ticker: string | null;
}

const QuoteItem: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
    <div className="flex flex-col">
        <span className="text-sm text-brand-light">{label}</span>
        <span className="text-lg font-semibold text-white">{value}</span>
    </div>
);

const StockNewsAndQuote: React.FC<StockNewsAndQuoteProps> = ({ ticker }) => {
    const [data, setData] = useState<{ quote: FinancialData; news: NewsArticle[] } | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!ticker) {
            setData(null);
            return;
        }

        const fetchData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const [quoteData, newsData] = await Promise.all([
                    fetchFinancialData(ticker),
                    fetchNewsWithGemini(ticker)
                ]);
                setData({ quote: quoteData, news: newsData });
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch data.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [ticker]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-8 mt-4 border-t border-brand-accent/50">
                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-light"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 mt-4 text-center text-brand-danger border-t border-brand-accent/50">
                <p><strong>Error:</strong> {error}</p>
            </div>
        );
    }

    if (!data) {
        return null; // Don't render anything if there's no ticker/data
    }

    const { quote, news } = data;

    return (
        <div className="mt-4 pt-4 border-t border-brand-accent/50">
            {/* Quote Section */}
            <div className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                    <ArrowTrendingUpIcon className="w-6 h-6 text-brand-light"/>
                    <h4 className="text-xl font-bold text-white">Ticker Quote</h4>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    <QuoteItem label="Price" value={`$${quote.price.toFixed(2)}`} />
                    <QuoteItem label="52-Wk High" value={`$${quote['52WeekHigh'].toFixed(2)}`} />
                    <QuoteItem label="52-Wk Low" value={`$${quote['52WeekLow'].toFixed(2)}`} />
                    <QuoteItem label="Market Cap" value={`${quote.marketCap}B`} />
                    <QuoteItem label="P/E Ratio" value={quote.peRatio} />
                    <QuoteItem label="ROE" value={`${(quote.roe * 100).toFixed(1)}%`} />
                    <QuoteItem label="Div Yield" value={`${(quote.dividendYield * 100).toFixed(2)}%`} />
                    <QuoteItem label="Debt/Equity" value={quote.debtToEquity} />
                </div>
            </div>

            {/* News Section */}
            <div>
                <div className="flex items-center gap-2 mb-3">
                    <NewspaperIcon className="w-6 h-6 text-brand-light"/>
                    <h4 className="text-xl font-bold text-white">Recent News</h4>
                </div>
                {news.length > 0 ? (
                    <ul className="space-y-3">
                        {news.map((item, index) => (
                            <li key={index} className="border-b border-brand-accent/30 pb-3 last:border-b-0 last:pb-0">
                                <a
                                    href={item.uri}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-brand-super-light hover:text-brand-light transition-colors duration-200 group"
                                >
                                    <p className="font-semibold group-hover:underline">{item.title}</p>
                                    <span className="text-xs text-brand-accent group-hover:text-brand-light truncate block">{item.uri}</span>
                                </a>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-brand-light">No recent news found.</p>
                )}
            </div>
        </div>
    );
};

export default StockNewsAndQuote;
