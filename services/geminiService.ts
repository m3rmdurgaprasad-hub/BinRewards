
import { GoogleGenAI, Type } from "@google/genai";
import { AIRewardRecommendation, UserProfile } from "../types";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async generatePersonalizedReward(user: UserProfile): Promise<AIRewardRecommendation> {
    const prompt = `You are an AI Loyalty Specialist for "Bin Rewards", a recycling-based loyalty system.
    Generate a creative, eco-friendly "Mystery Reward" for this user:
    - User Name: ${user.name}
    - Membership Level: ${user.level}
    - Total Earned to date: ${user.totalEarned} points
    - Current Balance: ${user.points} points
    
    The reward must:
    1. Be unique (e.g., "Priority Bin Pick-up", "Exclusive Green Workshop", "Community Garden Naming Rights").
    2. Be cost-effective for the user (between 500 and 3000 points).
    3. Include a 'reasoning' why this fits their profile.
    4. Be returned strictly as JSON.`;

    try {
      const response = await this.ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: { parts: [{ text: prompt }] },
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING, description: "Short catchy title" },
              description: { type: Type.STRING, description: "Engaging description" },
              cost: { type: Type.NUMBER, description: "Point cost" },
              reasoning: { type: Type.STRING, description: "Why we chose this" }
            },
            required: ["title", "description", "cost", "reasoning"]
          }
        }
      });

      const text = response.text || '';
      return JSON.parse(text) as AIRewardRecommendation;
    } catch (e) {
      console.error("AI Gen Failed:", e);
      return {
        title: "Rare Eco-Seeds Kit",
        description: "A selection of heirloom seeds delivered to your door to start your urban garden.",
        cost: 1200,
        reasoning: "Your consistent recycling shows you care about growth and sustainability!"
      };
    }
  }
}

export const geminiService = new GeminiService();
