/**
 * AI utilities for Base Creator Connect
 * 
 * This file contains utility functions for AI operations.
 */

import { OpenAI } from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENROUTER_API_KEY ? "https://openrouter.ai/api/v1" : undefined,
  dangerouslyAllowBrowser: true,
});

// Thank-you note generation options
export enum ThankYouStyle {
  CASUAL = 'casual',
  FORMAL = 'formal',
  FUNNY = 'funny',
  GRATEFUL = 'grateful',
  ENTHUSIASTIC = 'enthusiastic'
}

// Generate thank-you note
export const generateThankYouNote = async (
  message: string,
  amount: string,
  tierName?: string,
  style: ThankYouStyle = ThankYouStyle.GRATEFUL
): Promise<string> => {
  try {
    const prompt = `Generate a personalized thank-you note in a ${style} style for a fan who tipped ${amount} ETH${
      tierName ? ` (${tierName} tier)` : ''
    } with this message: "${message || 'No message'}"`;
    
    const completion = await openai.chat.completions.create({
      model: process.env.OPENROUTER_API_KEY ? 'google/gemini-2.0-flash-001' : 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 150,
    });
    
    return completion.choices[0].message.content || 'Thank you for your support!';
  } catch (error) {
    console.error('Error generating thank-you note:', error);
    return 'Thank you for your support!';
  }
};

// Generate reaction suggestion
export const generateReactionSuggestion = async (message: string): Promise<string> => {
  try {
    const prompt = `Suggest a single emoji reaction that best matches this fan message: "${message}"`;
    
    const completion = await openai.chat.completions.create({
      model: process.env.OPENROUTER_API_KEY ? 'google/gemini-2.0-flash-001' : 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 5,
    });
    
    return completion.choices[0].message.content || '❤️';
  } catch (error) {
    console.error('Error generating reaction suggestion:', error);
    return '❤️';
  }
};

// Cache for thank-you notes to reduce API calls
const thankYouCache = new Map<string, { note: string; timestamp: number }>();
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

// Get cached or generate new thank-you note
export const getCachedOrGenerateThankYouNote = async (
  message: string,
  amount: string,
  tierName?: string,
  style: ThankYouStyle = ThankYouStyle.GRATEFUL
): Promise<string> => {
  const cacheKey = `${message}:${amount}:${tierName}:${style}`;
  
  // Check cache
  const cached = thankYouCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.note;
  }
  
  // Generate new note
  const note = await generateThankYouNote(message, amount, tierName, style);
  
  // Cache result
  thankYouCache.set(cacheKey, { note, timestamp: Date.now() });
  
  return note;
};

