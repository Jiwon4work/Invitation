import { GoogleGenAI, Type } from "@google/genai";
import { InvitationContent } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateInvitation = async (): Promise<InvitationContent> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Write a warm, witty, and intimate invitation letter for a housewarming and year-end party. Language: Korean. The tone should be inviting, fun, and mindful.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            headline: {
              type: Type.STRING,
              description: "A short, catchy headline (e.g., You're Invited!).",
            },
            body: {
              type: Type.STRING,
              description: "The main body of the invitation. Include details about bringing a Manito gift, humor, and energy.",
            },
            signature: {
              type: Type.STRING,
              description: "A short closing signature.",
            },
          },
          required: ["headline", "body", "signature"],
        },
      },
    });

    const text = response.text;
    if (!text) {
        throw new Error("No response from Gemini");
    }
    return JSON.parse(text) as InvitationContent;
  } catch (error) {
    console.error("Error generating invitation:", error);
    // Fallback content with the specific user request
    return {
      headline: "You're Invited!",
      body: "제밀리 집들이 겸 연말 파티에\n당신을 초대합니다.\n\n마니또를 위한 선물과\n유머와 체력을 챙겨 오세요\n\n일시: 2025년 12월 6일 16:00\n장소: 새절역 인근 & 옹이네 House",
      signature: "사랑을 담아,"
    };
  }
};