import React, { useState } from 'react';
import { ChevronDownIcon } from './icons';

const criteria = [
  { name: 'Competitive Advantage', weight: 15, description: 'A defensible niche, proprietary tech, brand strength, or a moat.' },
  { name: 'Management Team', weight: 10, description: 'Capable, honest, and shareholder-oriented leadership.' },
  { name: 'Growth Potential', weight: 20, description: 'Consistent and accelerating top/bottom-line growth (ideally >20%).' },
  { name: 'Market Cap Size', weight: 5, description: 'Smaller cap stocks (ideally under $2 billion) have more room to grow.' },
  { name: 'Low Debt', weight: 10, description: 'A strong balance sheet is key (Debt/Equity ratio < 0.5 is favorable).' },
  { name: 'Capital Efficiency', weight: 10, description: 'Efficient use of capital (ROE & ROIC > 15% is favorable).' },
  { name: 'Addressable Market', weight: 10, description: 'Operates in a large, growing industry with room to scale.' },
  { name: 'Innovation', weight: 10, description: 'A disruptor or innovator in its field.' },
  { name: 'Long-Term Potential', weight: 5, description: 'Potential to compound value over many years.' },
  { name: 'Valuation', weight: 5, description: 'Reasonable valuation for its growth (PEG ratio <= 1.5 is favorable).' },
];

const CriteriaExplanation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-brand-secondary rounded-lg border border-brand-accent/50 overflow-hidden mb-8">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-4 text-left focus:outline-none focus:bg-brand-accent/30 transition-colors"
        aria-expanded={isOpen}
        aria-controls="criteria-details"
      >
        <h3 className="text-lg font-semibold text-white">
          Understanding the Gunderson Growth Criteria
        </h3>
        <ChevronDownIcon className={`w-5 h-5 text-brand-light transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div id="criteria-details" className="p-4 border-t border-brand-accent/50">
          <p className="text-brand-light mb-4">
            The analysis scores stocks based on Bill Gunderson's 10 key principles for identifying high-potential emerging growth companies. Each criterion is weighted to reflect its importance.
          </p>
          <ul className="space-y-3">
            {criteria.map((item) => (
              <li key={item.name} className="flex flex-col sm:flex-row gap-2">
                <div className="flex-shrink-0 w-full sm:w-1/3 font-semibold text-brand-super-light">
                  {item.name} <span className="font-normal text-brand-light">({item.weight}%)</span>
                </div>
                <div className="flex-grow text-brand-light">
                  {item.description}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CriteriaExplanation;
