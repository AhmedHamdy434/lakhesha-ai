// gemini.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import { SUMMARY_SYSTEM_PROMPT } from "@/utils/prompts";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY! || "");

export const generatePdfSummaryByGemini = async (pdfText: string) => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: { temperature: 0.7, maxOutputTokens: 3000 },
    });
    const prompt = {
      contents: [
        {
          role: "user",
          parts: [
            { text: SUMMARY_SYSTEM_PROMPT },
            {
              text: `Transform this document into an engaging, easy-to-read summary with contextually relevant emojis and proper markdown formatting:\n\n${pdfText}`,
            },
          ],
        },
      ],
    };
    const result = await model.generateContent(prompt);
    const response = await result.response;

    if (!response.text()) {
      throw new Error("Empty response from Gemini");
    }

    return response.text();
  } catch (error: any) {
    // Gemini doesn’t return HTTP-style status codes, so we look for quota text
    if (error.status === 429) {
      throw new Error("Rate limit exceeded");
    }
    console.error("Gemini API failed", error);
    throw error;
  }
};
