
import React, { useEffect, useRef } from 'react';
import { ChartBarIcon } from './icons';
import StockNewsAndQuote from './StockNewsAndQuote';

declare const TradingView: any;

interface StockChartProps {
  ticker: string | null;
}

const StockChart: React.FC<StockChartProps> = ({ ticker }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ticker || !containerRef.current || typeof TradingView === 'undefined') {
        if (containerRef.current) {
            containerRef.current.innerHTML = '';
        }
      return;
    }

    // Clear previous widget before creating a new one
    containerRef.current.innerHTML = '';

    new TradingView.widget({
      width: '100%',
      height: 510,
      symbol: ticker,
      interval: 'D',
      timezone: 'Etc/UTC',
      theme: 'dark',
      style: '1',
      locale: 'en',
      enable_publishing: false,
      allow_symbol_change: false,
      container_id: containerRef.current.id,
    });
  }, [ticker]);

  const containerId = 'tradingview-widget-container';

  return (
    <div className="bg-brand-secondary rounded-lg shadow-xl p-4 border border-brand-accent/50">
      {ticker ? (
        <>
          <div ref={containerRef} id={containerId} className="tradingview-widget-container h-[510px]" />
          <StockNewsAndQuote ticker={ticker} />
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-[510px] text-center text-brand-light">
          <ChartBarIcon className="w-16 h-16 mb-4 text-brand-accent" />
          <h3 className="text-xl font-semibold text-white">Live Stock Chart</h3>
          <p className="mt-2">Add a stock or select an analyzed stock to view its chart here.</p>
        </div>
      )}
    </div>
  );
};

export default StockChart;
