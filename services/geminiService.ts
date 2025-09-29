import { GoogleGenAI } from "@google/genai";
import { PromptDetail } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const model = 'gemini-2.5-flash';

const getMetaPrompt = (input: string, detail: PromptDetail): string => {
    const baseIntro = `You are an expert prompt engineer named 'PromptCraft AI'. Your purpose is to transform a user's brief, unrefined idea into a highly effective prompt, ready for direct use with any large language model (LLM).`;

    switch (detail) {
        case 'small':
            return `You are an expert prompt engineer. Your task is to transform a user's idea into a short, concise, and direct prompt for an LLM. The prompt should be a single paragraph and focus on the main goal, role, and task.\n\nUSER'S IDEA: "${input}"`;
        case 'detailed':
            return `${baseIntro} The goal is to leave no room for ambiguity by creating an exceptionally detailed and comprehensive prompt.\n\nWhen you synthesize a prompt, you MUST include the following sections, formatted clearly with Markdown headings:\n\n1.  **PERSONA:** Create a detailed persona for the LLM.\n2.  **PRIMARY OBJECTIVE:** Clearly state the main goal of the task.\n3.  **DETAILED CONTEXT:** Provide rich background information.\n4.  **STEP-BY-STEP INSTRUCTIONS:** Break down the task into a numbered list.\n5.  **KEY CONSTRAINTS & GUARDRAILS:** List specific rules to adhere to.\n6.  **EXAMPLE OUTPUT:** Provide a small, concrete example of the desired output.\n7.  **TONE & STYLE:** Specify the desired tone and writing style.\n8.  **OUTPUT FORMAT:** Define the exact structure for the final output.\n\nNow, take the following user's idea and synthesize an exceptionally detailed prompt based on the structure above.\n\nUSER'S IDEA: "${input}"`;
        case 'medium':
        default:
            return `${baseIntro}\n\nWhen you synthesize a prompt, you MUST include the following sections, formatted clearly with Markdown headings:\n\n1.  **ROLE:** Define a clear role for the LLM.\n2.  **TASK:** State the primary objective clearly.\n3.  **CONTEXT:** Provide necessary background information.\n4.  **CONSTRAINTS:** List specific guardrails or rules.\n5.  **OUTPUT FORMAT:** Specify the desired format for the output.\n\nNow, take the following user's idea and synthesize a detailed prompt based on the structure above.\n\nUSER'S IDEA: "${input}"`;
    }
};

export const synthesizePrompt = async (input: string, detail: PromptDetail): Promise<string> => {
    const metaPrompt = getMetaPrompt(input, detail);
    const response = await ai.models.generateContent({
        model,
        contents: metaPrompt,
    });
    return response.text;
};

export const generateContent = async (prompt: string): Promise<string> => {
    const response = await ai.models.generateContent({
        model,
        contents: prompt,
    });
    return response.text;
};
