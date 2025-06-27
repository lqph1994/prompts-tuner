import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || '' });
const anthropic = new Anthropic({ apiKey: process.env.CLAUDE_API_KEY || '' });

const refineInstruction = `You are an expert prompt engineer. Your role is to refine the user's prompt to make it more effective and to provide three different variations.

Context: The user is providing a prompt that they want to improve. Your task is to analyze this prompt and generate three high-quality, diverse variations. One of these variations should be a "red team" prompt, designed to test the model's boundaries and elicit unexpected or undesirable responses.

Instructions:
1.  Analyze the user's prompt for clarity, context, and potential ambiguities.
2.  Create three distinct variations of the prompt:
    *   **Variation 1 (Improved):** A refined version of the original prompt that is clearer, more specific, and provides better context.
    *   **Variation 2 (Creative):** An alternative version that approaches the user's goal from a different creative angle.
    *   **Variation 3 (Red Team):** A prompt designed to challenge the model, testing for biases, ethical boundaries, or unexpected interpretations.
3.  Return the variations as a JSON array of strings. For example: ["variation 1", "variation 2", "variation 3"]`;

export async function POST(request: Request) {
  const { prompt, provider, model } = await request.json();
  console.log("Received model:", model, "for provider:", provider);

  let refinedPrompts: string[] = [];

  try {
    switch (provider) {
      case 'gemini':
        const geminiModel = genAI.getGenerativeModel({ model });
        const result = await geminiModel.generateContent(`${refineInstruction}\n\nPrompt: ${prompt}`);
        const response = await result.response;
        const text = response.text().replace(/```json|```/g, '').trim();
        refinedPrompts = JSON.parse(text);
        break;
      case 'openai':
        const openaiResponse = await openai.chat.completions.create({
          model,
          messages: [{ role: 'user', content: `${refineInstruction}\n\nPrompt: ${prompt}` }],
        });
        const openAIContent = openaiResponse.choices[0].message.content || '[]';
        refinedPrompts = JSON.parse(openAIContent);
        break;
      case 'claude':
        const claudeResponse = await anthropic.messages.create({
          model,
          max_tokens: 1024,
          messages: [{ role: 'user', content: `${refineInstruction}\n\nPrompt: ${prompt}` }],
        });
        const claudeContent = claudeResponse.content[0].text.replace(/```json|```/g, '').trim();
        refinedPrompts = JSON.parse(claudeContent);
        break;
      default:
        return NextResponse.json({ error: 'Invalid provider selected' }, { status: 400 });
    }

    return NextResponse.json({ refinedPrompts });
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}