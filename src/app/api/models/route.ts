import { NextResponse } from 'next/server';
import OpenAI from 'openai';

interface GeminiModel {
  id: string;
  supportedGenerationMethods: string[];
  name: string;
}

export async function GET() {
  let openaiModels: string[] = [];
  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || '' });
    const openaiModelsList = await openai.models.list();
    openaiModels = openaiModelsList.data
      .filter(model => model.id.startsWith('gpt-'))
      .map(model => model.id);
  } catch (error) {
    console.error('Error fetching OpenAI models:', error);
    // Fallback for OpenAI models if API call fails
    openaiModels = ['gpt-4o', 'gpt-4-turbo', 'gpt-3.5-turbo'];
  }

  let geminiModels: string[] = [];
  try {
    const geminiApiKey = process.env.GEMINI_API_KEY;
    const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${geminiApiKey}`);
    if (geminiResponse.status === 429) {
      return NextResponse.json({ error: 'Gemini API rate limit exceeded. Please try again later.' }, { status: 429 });
    }
    const geminiData = await geminiResponse.json();
    if (geminiData.models && Array.isArray(geminiData.models)) {
      geminiModels = (geminiData.models as GeminiModel[])
        .filter((model: GeminiModel) => 
          model.supportedGenerationMethods.includes('generateContent') && model.name.includes('gemini')
        )
        .map((model: GeminiModel) => model.name);
    }
    // Ensure a default Gemini model is available if the API returns an empty list
    if (geminiModels.length === 0) {
      geminiModels.push('gemini-1.5-flash'); // Fallback to a common Gemini model
    }
  } catch (error: any) {
    console.error('Error fetching Gemini models:', error);
    // Fallback for Gemini models if API call fails
    geminiModels = ['gemini-1.5-flash', 'gemini-pro'];
  }

  const models = {
    gemini: geminiModels,
    openai: openaiModels,
    claude: ['claude-3-opus-20240229', 'claude-3-sonnet-20240229', 'claude-3-haiku-20240307'],
  };

  return NextResponse.json(models);
}
