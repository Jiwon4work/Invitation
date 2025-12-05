import { GoogleGenAI, Type } from "@google/genai";
import { InvitationContent, InvitationFormData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateInvitation = async (formData: InvitationFormData): Promise<InvitationContent> => {
  try {
    const prompt = `
      Write a warm, witty, and intimate invitation letter in Korean based on these details:
      - Host: ${formData.hostName}
      - Event: ${formData.eventName}
      - Date: ${formData.date}
      - Time: ${formData.time}
      - Location: ${formData.location}
      - Key Details/Tone: ${formData.details}

      The tone should be inviting, fun, and mindful.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
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
              description: "The main body of the invitation letter. Include the host, event, date, time, location, and details naturally. Use \\n for line breaks.",
            },
            signature: {
              type: Type.STRING,
              description: "A short sign-off (e.g., Sincerely, [Host Name]).",
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
    // Fallback in case of error
    return {
      headline: "초대합니다",
      body: "죄송합니다. AI가 잠시 휴식 중입니다.\n하지만 당신을 향한 환영의 마음은 변함없습니다.\n\n꼭 와주실 거죠?",
      signature: `From ${formData.hostName}`
    };
  }
};