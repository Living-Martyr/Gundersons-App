
import React from 'react';

interface ScoreBarProps {
  score: number;
}

const ScoreBar: React.FC<ScoreBarProps> = ({ score }) => {
  const getBarColor = (s: number) => {
    if (s >= 80) return 'bg-brand-success';
    if (s >= 60) return 'bg-green-500';
    if (s >= 40) return 'bg-brand-warning';
    return 'bg-brand-danger';
  };

  const colorClass = getBarColor(score);
  const widthPercentage = Math.max(0, Math.min(100, score));

  return (
    <div className="w-full bg-brand-accent rounded-full h-2.5">
      <div
        className={`${colorClass} h-2.5 rounded-full transition-all duration-500 ease-out`}
        style={{ width: `${widthPercentage}%` }}
      ></div>
    </div>
  );
};

export default ScoreBar;
