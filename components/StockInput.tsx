import React, { useState } from 'react';
import { PlusIcon } from './icons';

interface StockInputProps {
  onAddStock: (ticker: string) => void;
  isLoading: boolean;
}

const StockInput: React.FC<StockInputProps> = ({ onAddStock, isLoading }) => {
  const [ticker, setTicker] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (ticker.trim() && !isLoading) {
      onAddStock(ticker.trim().toUpperCase());
      setTicker('');
    }
  };

  return (
    <div className="w-full max-w-md">
      <form onSubmit={handleSubmit} className="flex gap-2 w-full">
        <input
          type="text"
          value={ticker}
          onChange={(e) => setTicker(e.target.value)}
          placeholder="Enter stock ticker (e.g., AAPL)"
          className="flex-grow bg-brand-secondary border border-brand-accent rounded-md px-4 py-3 text-brand-super-light placeholder-brand-light focus:outline-none focus:ring-2 focus:ring-brand-light transition-all duration-300"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="flex items-center justify-center bg-brand-accent hover:bg-brand-light text-brand-primary font-bold py-3 px-5 rounded-md transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-brand-primary"></div>
          ) : (
            <>
              <PlusIcon className="w-5 h-5 mr-2" />
              <span>Add</span>
            </>
          )}
        </button>
      </form>
      <p className="text-sm text-brand-super-light mt-3 text-center px-2" role="status">
        Please note: Initial analysis of new stocks may take over a minute to process.
      </p>
    </div>
  );
};

export default StockInput;