const { GoogleGenAI, GenerateImagesResponse } = require("@google/genai");

const ai = new GoogleGenAI({});

async function generateResponse(historyTimeline) {
    const response = await ai.models.generateContent({
        model : "gemini-3.5-flash",
        contents: historyTimeline
    })
    return response.text
}

module.exports = generateResponse