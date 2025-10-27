import React, { useState, useCallback } from 'react';
import StockInput from './components/StockInput';
import StockCard from './components/StockCard';
import StockChart from './components/StockChart';
import { fetchFinancialData } from './services/financialService';
import { analyzeStockWithGemini } from './services/geminiService';
import type { StockAnalysis } from './types';
import { ChartBarIcon } from './components/icons';
import CriteriaExplanation from './components/CriteriaExplanation';

const App: React.FC = () => {
  const [stocks, setStocks] = useState<StockAnalysis[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTicker, setSelectedTicker] = useState<string | null>(null);

  const handleAddStock = useCallback(async (ticker: string) => {
    if (stocks.some(s => s.ticker === ticker)) {
        setError(null);
        setSelectedTicker(ticker);
        return;
    }
    
    setIsLoading(true);
    setError(null);
    try {
      const financialData = await fetchFinancialData(ticker);
      const analysis = await analyzeStockWithGemini(ticker, financialData);
      setStocks(prevStocks => [analysis, ...prevStocks]);
      setSelectedTicker(analysis.ticker);
    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [stocks]);

  const handleSelectStock = (ticker: string) => {
    setSelectedTicker(ticker);
  };

  return (
    <div className="min-h-screen bg-brand-primary font-sans">
      <main className="container mx-auto px-4 py-8 md:py-12">
        <header className="text-center mb-10">
            <div className="flex justify-center items-center gap-4 mb-2">
                <ChartBarIcon className="w-12 h-12 text-brand-light"/>
                <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
                    Gunderson Growth Analyzer
                </h1>
            </div>
          <p className="text-lg text-brand-light max-w-2xl mx-auto">
            Analyze emerging growth stocks using Bill Gunderson's key principles.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
                <div className="flex justify-center mb-10">
                    <StockInput onAddStock={handleAddStock} isLoading={isLoading} />
                </div>

                <CriteriaExplanation />
                
                {error && (
                    <div className="bg-red-900/50 border border-brand-danger text-red-200 px-4 py-3 rounded-md relative mb-6 text-center" role="alert">
                        <strong className="font-bold">Error: </strong>
                        <span className="block sm:inline">{error}</span>
                    </div>
                )}

                {stocks.length === 0 && !isLoading && (
                    <div className="text-center py-16 px-6 bg-brand-secondary rounded-lg border-2 border-dashed border-brand-accent">
                        <h3 className="text-xl font-semibold text-white">Your analysis dashboard is empty</h3>
                        <p className="mt-2 text-brand-light">Add a stock ticker above to get started!</p>
                    </div>
                )}

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                  {stocks.map(stock => (
                    <StockCard 
                        key={stock.ticker} 
                        analysis={stock} 
                        isSelected={selectedTicker === stock.ticker}
                        onSelect={handleSelectStock}
                    />
                  ))}
                </div>
            </div>
            <div className="lg:col-span-1">
                <div className="sticky top-8">
                    <StockChart ticker={selectedTicker} />
                </div>
            </div>
        </div>
      </main>
    </div>
  );
};

export default App;