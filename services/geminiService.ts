
import { GoogleGenAI, Type } from "@google/genai";
import type { FinancialData, StockAnalysis, NewsArticle } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const getAnalysisPrompt = (ticker: string, data: FinancialData): string => `
You are a senior stock analyst specializing in emerging growth stocks, using Bill Gunderson's investment philosophy.
Your task is to analyze the provided financial data for the stock ticker ${ticker} and produce a score from 0-100 for each of the 10 criteria, along with a brief justification for each score.
Finally, calculate the weighted score based on the specified weights.

**Gunderson's Emerging Growth Criteria & Weights:**

1.  **Competitive Advantage (Weight: 15%)**: Does the company have a defensible niche, proprietary tech, brand strength, or a moat? For this, you may need to infer based on the company's reputation if it's a well-known ticker.
2.  **Management Team (Weight: 10%)**: Is leadership capable, honest, and shareholder-oriented? Is it founder-led? (Infer based on public knowledge of the company).
3.  **Growth Potential (Weight: 20%)**: Look for consistent and accelerating top/bottom-line growth. Prioritize high revenue growth. Favorable: Revenue/EPS Growth > 20%.
4.  **Market Cap Size (Weight: 5%)**: Ideal is under $2 billion. Score high for small caps, low for large caps.
5.  **Low Debt (Weight: 10%)**: A strong balance sheet is key. Favorable: Debt/Equity ratio < 0.5.
6.  **Capital Efficiency (ROE & ROIC) (Weight: 10%)**: Efficient capital use. Favorable: ROE & ROIC > 15%.
7.  **Addressable Market (Weight: 10%)**: Does the company operate in a large, growing industry with room to scale? (Infer based on public knowledge of the industry).
8.  **Innovation (Weight: 10%)**: Is the company a disruptor or innovator in its field? (Infer based on public knowledge).
9.  **Long-Term Potential (Weight: 5%)**: Based on all factors, does this seem like a company that can compound value over many years? This is a summary score of its long-term potential.
10. **Valuation (Weight: 5%)**: Is the valuation reasonable for its growth? Favorable: PEG ratio <= 1.5. Avoid extremely high P/E, P/B ratios unless growth justifies it.

**Stock Data for ${ticker}:**
${JSON.stringify(data, null, 2)}
(Note: Market Cap is in billions of USD)

Analyze the data against the criteria and provide your scores and justifications. Be critical and objective. For qualitative criteria (like Management, Innovation), use general knowledge about the company. For ${ticker}, assume it's the well-known public company.
Respond ONLY with the JSON object that adheres to the provided schema. Do not include any other text or markdown formatting.
`;

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    ticker: { type: Type.STRING },
    scores: {
      type: Type.OBJECT,
      properties: {
        competitiveAdvantage: {
          type: Type.OBJECT,
          properties: { score: { type: Type.NUMBER }, justification: { type: Type.STRING } },
        },
        managementTeam: {
          type: Type.OBJECT,
          properties: { score: { type: Type.NUMBER }, justification: { type: Type.STRING } },
        },
        growthPotential: {
          type: Type.OBJECT,
          properties: { score: { type: Type.NUMBER }, justification: { type: Type.STRING } },
        },
        marketCapSize: {
          type: Type.OBJECT,
          properties: { score: { type: Type.NUMBER }, justification: { type: Type.STRING } },
        },
        lowDebt: {
          type: Type.OBJECT,
          properties: { score: { type: Type.NUMBER }, justification: { type: Type.STRING } },
        },
        capitalEfficiency: {
          type: Type.OBJECT,
          properties: { score: { type: Type.NUMBER }, justification: { type: Type.STRING } },
        },
        addressableMarket: {
          type: Type.OBJECT,
          properties: { score: { type: Type.NUMBER }, justification: { type: Type.STRING } },
        },
        innovation: {
          type: Type.OBJECT,
          properties: { score: { type: Type.NUMBER }, justification: { type: Type.STRING } },
        },
        longTermPotential: {
          type: Type.OBJECT,
          properties: { score: { type: Type.NUMBER }, justification: { type: Type.STRING } },
        },
        valuation: {
          type: Type.OBJECT,
          properties: { score: { type: Type.NUMBER }, justification: { type: Type.STRING } },
        },
      },
    },
    weightedScore: { type: Type.NUMBER },
  },
};

export const analyzeStockWithGemini = async (ticker: string, data: FinancialData): Promise<StockAnalysis> => {
  const prompt = getAnalysisPrompt(ticker, data);

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.2,
      },
    });

    const jsonText = response.text.trim();
    const analysisResult = JSON.parse(jsonText) as StockAnalysis;
    return analysisResult;
  } catch (error) {
    console.error("Error analyzing stock with Gemini:", error);
    throw new Error("Failed to get analysis from Gemini. The model may have returned an invalid format.");
  }
};

export const fetchNewsWithGemini = async (ticker: string): Promise<NewsArticle[]> => {
    const prompt = `Provide a summary of the latest news and updates for the stock ticker: ${ticker}. Focus on recent events, earnings reports, and market sentiment.`;
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          tools: [{googleSearch: {}}],
        },
      });
  
      const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks ?? [];
      
      const uniqueNews = new Map<string, NewsArticle>();
      groundingChunks
        .filter(chunk => chunk.web && chunk.web.uri && chunk.web.title)
        .forEach(chunk => {
            if (!uniqueNews.has(chunk.web.uri)) {
                uniqueNews.set(chunk.web.uri, {
                    title: chunk.web.title,
                    uri: chunk.web.uri,
                });
            }
        });
      
      const newsArticles = Array.from(uniqueNews.values()).slice(0, 5); // Limit to 5 articles

      if (newsArticles.length === 0) {
        console.warn("No news articles found from grounding chunks for ticker:", ticker);
      }

      return newsArticles;

    } catch (error) {
      console.error(`Error fetching news for ${ticker}:`, error);
      throw new Error(`Failed to fetch news for ${ticker}.`);
    }
  };
