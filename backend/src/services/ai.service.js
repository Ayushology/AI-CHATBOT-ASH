const { GoogleGenAI, GenerateImagesResponse } = require("@google/genai");

const ai = new GoogleGenAI({});

async function generateResponse(historyTimeline) {
    const response = await ai.models.generateContent({
        model : "gemini-3.1-flash-lite",
        contents: historyTimeline
    })
    return response.text
}

module.exports = generateResponse