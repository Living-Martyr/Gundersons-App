import { GoogleGenAI } from "@google/genai";
import type { FinancialData } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const fetchFinancialData = async (ticker: string): Promise<FinancialData> => {
  console.log(`Fetching REAL-TIME financial data for ${ticker.toUpperCase()} using Gemini...`);
  
  const prompt = `
    Use Google Search to find the latest real-time financial data for the stock ticker "${ticker}".
    Provide the following key metrics. Ensure the data is as current as possible.
    - Current Stock Price
    - 50-day Simple Moving Average (SMA)
    - 200-day Simple Moving Average (SMA)
    - 52-Week High
    - 52-Week Low
    - Price-to-Earnings (P/E) Ratio (Trailing Twelve Months, TTM)
    - Price/Earnings to Growth (PEG) Ratio (TTM)
    - Price-to-Book (P/B) Ratio
    - EPS Growth (latest quarter vs. same quarter last year), as a decimal
    - Revenue Growth (latest quarter vs. same quarter last year), as a decimal
    - Return on Equity (ROE) (TTM), as a decimal
    - 14-day Relative Strength Index (RSI)
    - MACD Histogram value
    - Forward P/E Ratio
    - Enterprise Value to EBITDA (EV/EBITDA)
    - Free Cash Flow (FCF) Yield, as a decimal
    - Dividend Yield, as a decimal
    - Market Capitalization (in billions of USD)
    - Total Debt to Equity Ratio
    - Return on Invested Capital (ROIC) (TTM), as a decimal

    If a specific metric is not available or applicable, return null for that field.
    Respond ONLY with a single JSON object containing the fields: price, sma50, sma200, "52WeekHigh", "52WeekLow", peRatio, pegRatio, pbRatio, epsGrowth, revenueGrowth, roe, rsi14, macdHistogram, forwardPE, evEbitda, fcfYield, dividendYield, marketCap, debtToEquity, roic. Do not include any other text, explanations, or markdown formatting.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{googleSearch: {}}],
        temperature: 0.0,
      },
    });

    let jsonText = response.text.trim();
    
    // Handle cases where the model wraps the JSON in a markdown code block
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.slice(7, -3).trim();
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.slice(3, -3).trim();
    }
    
    const fetchedData = JSON.parse(jsonText) as Partial<FinancialData>;
    
    // Create a fallback object with default zero values for all fields.
    const fallbackData: FinancialData = {
        price: 0, sma50: 0, sma200: 0, '52WeekHigh': 0, '52WeekLow': 0,
        peRatio: 0, pegRatio: 0, pbRatio: 0, epsGrowth: 0, revenueGrowth: 0, roe: 0,
        rsi14: 0, macdHistogram: 0, forwardPE: 0, evEbitda: 0, fcfYield: 0, dividendYield: 0,
        marketCap: 0, debtToEquity: 0, roic: 0
    };

    // Merge fetched data with the fallback. Any fields that are null or missing in the API response
    // will be replaced by the zero value from the fallback object.
    const validatedData = { ...fallbackData };
    for (const key in fallbackData) {
        const typedKey = key as keyof FinancialData;
        if (fetchedData[typedKey] !== null && typeof fetchedData[typedKey] === 'number') {
            (validatedData[typedKey] as number) = fetchedData[typedKey]!;
        }
    }

    return validatedData;

  } catch (error) {
    console.error(`Error fetching financial data for ${ticker} with Gemini:`, error);
    throw new Error(`Failed to get real-time financial data for ${ticker}. The API might be temporarily unavailable or the ticker is invalid.`);
  }
};