    import { OpenAI } from 'openai';
    import { NextResponse } from 'next/server';

    export async function POST(request) {
      const { message } = await request.json();

      const openai = new OpenAI({
        apiKey: process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY,
        baseURL: "https://openrouter.ai/api/v1",
        dangerouslyAllowBrowser: true,
      });

      const completion = await openai.chat.completions.create({
        model: 'google/gemini-2.0-flash-001',
        messages: [{ role: 'user', content: `Generate a personalized thank-you note for this fan tip message: ${message}` }],
      });

      return NextResponse.json({ note: completion.choices[0].message.content });
    }
  