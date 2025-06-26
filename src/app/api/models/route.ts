import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || '' });

export async function GET() {
  try {
    // Fetch OpenAI models
    const openaiModelsList = await openai.models.list();
    const openaiModels = openaiModelsList.data
      .filter(model => model.id.startsWith('gpt-'))
      .map(model => model.id);

    // Fetch Gemini models
    const geminiApiKey = process.env.GEMINI_API_KEY;
    const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${geminiApiKey}`);
    const geminiData = await geminiResponse.json();
    const geminiModels = geminiData.models
      .filter((model: any) => 
        model.supportedGenerationMethods.includes('generateContent') && model.id.includes('gemini')
      )
      .map((model: any) => model.name);

    const models = {
      gemini: geminiModels,
      openai: openaiModels,
      claude: ['claude-3-opus-20240229', 'claude-3-sonnet-20240229', 'claude-3-haiku-20240307'],
    };

    return NextResponse.json(models);
  } catch (error) {
    console.error('Error fetching models:', error);
    // Fallback to hardcoded models in case of an error
    const fallbackModels = {
      gemini: ['gemini-1.5-flash', 'gemini-pro'],
      openai: ['gpt-4o', 'gpt-4-turbo', 'gpt-3.5-turbo'],
      claude: ['claude-3-opus-20240229', 'claude-3-sonnet-20240229', 'claude-3-haiku-20240307'],
    };
    return NextResponse.json(fallbackModels);
  }
}
