import { SchemaType } from "@google/generative-ai";

// Create an enum for Gemini Models 
export const GeminiModels = Object.freeze({
    "gemini-1.5-flash": "gemini-1.5-flash",
    "gemini-1.5-flash-8b-exp-0827": "gemini-1.5-flash-8b-exp-0827", 
    "gemini-1.5-flash-exp-0827": "gemini-1.5-flash-exp-0827", 
    "gemini-1.5-pro-exp-0827": "gemini-1.5-pro-exp-0827", 
    "gemini-1.5-pro": "gemini-1.5-pro", 
    "gemini-1.0-pro": "gemini-1.0-pro",
}); 

// Create a custom response schema for Gemini 
export const geminiResponseSchema = {
    description: "Oject",
    type: SchemaType.OBJECT,
    properties: {
        jsonOutput: {
        type: SchemaType.STRING,
        description: "JSON output",
        nullable: false,
        },
    },
    required: ["jsonOutput"],
}
