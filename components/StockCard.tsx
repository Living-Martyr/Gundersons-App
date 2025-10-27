
import React from 'react';
import type { StockAnalysis, StockScores } from '../types';
import ScoreBar from './ScoreBar';

interface StockCardProps {
  analysis: StockAnalysis;
  isSelected: boolean;
  onSelect: (ticker: string) => void;
}

const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-brand-success';
    if (score >= 60) return 'text-green-500';
    if (score >= 40) return 'text-brand-warning';
    return 'text-brand-danger';
};

const CriterionRow: React.FC<{ name: string; score: number; justification: string; weight: number }> = ({ name, score, justification, weight }) => (
    <div className="py-3 border-b border-brand-accent/50 last:border-b-0">
        <div className="flex justify-between items-center mb-1">
            <h4 className="font-semibold text-brand-super-light">{name} <span className="text-sm font-normal text-brand-light">({weight}%)</span></h4>
            <span className={`font-bold text-lg ${getScoreColor(score)}`}>{score}</span>
        </div>
        <ScoreBar score={score} />
        <p className="text-sm text-brand-light mt-2">{justification}</p>
    </div>
);


const StockCard: React.FC<StockCardProps> = ({ analysis, isSelected, onSelect }) => {
  const { ticker, scores, weightedScore } = analysis;

  const criteria: { name: string; key: keyof StockScores; weight: number }[] = [
    { name: 'Competitive Advantage', key: 'competitiveAdvantage', weight: 15 },
    { name: 'Management Team', key: 'managementTeam', weight: 10 },
    { name: 'Growth Potential', key: 'growthPotential', weight: 20 },
    { name: 'Market Cap Size', key: 'marketCapSize', weight: 5 },
    { name: 'Low Debt', key: 'lowDebt', weight: 10 },
    { name: 'Capital Efficiency (ROE/ROIC)', key: 'capitalEfficiency', weight: 10 },
    { name: 'Addressable Market', key: 'addressableMarket', weight: 10 },
    { name: 'Innovation', key: 'innovation', weight: 10 },
    { name: 'Long-Term Potential', key: 'longTermPotential', weight: 5 },
    { name: 'Valuation', key: 'valuation', weight: 5 },
  ];

  const borderClass = isSelected 
    ? 'ring-2 ring-brand-light ring-offset-2 ring-offset-brand-primary' 
    : 'border border-brand-accent/50';

  return (
    <div
        onClick={() => onSelect(ticker)}
        className={`bg-brand-secondary rounded-lg shadow-xl p-6 flex flex-col gap-4 transition-all hover:shadow-2xl hover:border-brand-light/50 cursor-pointer ${borderClass}`}
        role="button"
        tabIndex={0}
        onKeyPress={(e) => (e.key === 'Enter' || e.key === ' ') && onSelect(ticker)}
        >
        <div className="flex justify-between items-center">
            <h2 className="text-3xl font-bold text-white">{ticker}</h2>
            <div className="flex flex-col items-center">
                <div className={`flex items-center justify-center w-20 h-20 rounded-full border-4 ${getScoreColor(weightedScore)} border-current`}>
                    <span className={`text-3xl font-bold ${getScoreColor(weightedScore)}`}>
                        {Math.round(weightedScore)}
                    </span>
                </div>
                <span className="text-xs font-semibold text-brand-light mt-1">Overall Score</span>
            </div>
        </div>

        <div className="flex flex-col">
            {criteria.map((c) => (
                <CriterionRow 
                    key={c.key} 
                    name={c.name}
                    score={scores[c.key].score}
                    justification={scores[c.key].justification}
                    weight={c.weight}
                />
            ))}
        </div>
    </div>
  );
};

export default StockCard;
