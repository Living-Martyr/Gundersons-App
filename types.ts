
export interface CriterionScore {
  score: number;
  justification: string;
}

export interface StockScores {
  competitiveAdvantage: CriterionScore;
  managementTeam: CriterionScore;
  growthPotential: CriterionScore;
  marketCapSize: CriterionScore;
  lowDebt: CriterionScore;
  capitalEfficiency: CriterionScore; // ROE & ROIC
  addressableMarket: CriterionScore;
  innovation: CriterionScore;
  longTermPotential: CriterionScore;
  valuation: CriterionScore;
}

export interface StockAnalysis {
  ticker: string;
  scores: StockScores;
  weightedScore: number;
}

export interface FinancialData {
  price: number;
  sma50: number;
  sma200: number;
  '52WeekHigh': number;
  '52WeekLow': number;
  peRatio: number;
  pegRatio: number;
  pbRatio: number;
  epsGrowth: number;
  revenueGrowth: number;
  roe: number;
  rsi14: number;
  macdHistogram: number;
  forwardPE: number;
  evEbitda: number;
  fcfYield: number;
  dividendYield: number;
  // New fields for growth analysis
  marketCap: number; // in billions
  debtToEquity: number;
  roic: number;
}

export interface NewsArticle {
  title: string;
  uri: string;
}
