
import { GoogleGenAI } from "@google/genai";

// IMPORTANT: This check is for the local environment.
// In the production environment, the API key is expected to be set.
const API_KEY = process.env.API_KEY;
if (!API_KEY) {
    console.warn("API_KEY environment variable not set. Using a placeholder.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY || "YOUR_API_KEY_HERE" });

const systemInstruction = `You are "AI Mentor" for SINAW, an e-learning platform focused on Digital Marketing. Your users are students, small business owners (UMKM), and beginners from Indonesia.
- Your tone should be encouraging, professional, and educational.
- Provide practical, actionable advice.
- Keep responses concise and easy to understand for a mobile chat interface.
- If asked about something outside digital marketing, gently steer the conversation back.
- Do not mention that you are an AI model. You are the AI Mentor.
- Your responses must be in Indonesian.`;

export const getMentorResponse = async (prompt: string): Promise<string> => {
    if (!API_KEY) {
        // Dummy response for when API key is not available
        await new Promise(resolve => setTimeout(resolve, 1500));
        const dummyResponses = [
            "Untuk meningkatkan engagement, fokuslah pada konten interaktif dan gunakan CTA yang jelas.",
            "Analisis kompetitor adalah langkah awal yang baik. Coba lihat apa yang berhasil untuk mereka.",
            "Konsistensi dalam posting sangat penting untuk membangun audiens yang loyal. Buatlah jadwal konten.",
            "Gunakan visual yang menarik! Gambar dan video pendek seringkali lebih efektif daripada teks saja."
        ];
        return dummyResponses[Math.floor(Math.random() * dummyResponses.length)];
    }

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                systemInstruction: systemInstruction,
                temperature: 0.7,
            },
        });
        return response.text;
    } catch (error) {
        console.error("Error getting response from Gemini:", error);
        return "Maaf, terjadi sedikit kendala. Bisakah kamu mengulangi pertanyaanmu?";
    }
};
