/**
 * Widget API for Base Creator Connect
 * 
 * This file provides the API for the embeddable widget.
 */

import { NextRequest, NextResponse } from 'next/server';
import { creatorOperations } from '@/lib/supabase';
import { handleApiError } from '@/lib/error';

// Base URL for the app
const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://base-creator-connect.vercel.app';

// Generate embed code
const generateEmbedCode = (creatorId: string, options: any = {}) => {
  const { width = '100%', height = '400px', theme = 'light' } = options;
  
  return `<iframe
  src="${BASE_URL}/widget/${creatorId}?theme=${theme}"
  width="${width}"
  height="${height}"
  frameborder="0"
  allow="clipboard-write; encrypted-media"
  style="border-radius: 10px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);"
></iframe>`;
};

// Generate Farcaster frame code
const generateFarcasterFrameCode = (creatorId: string) => {
  return `<meta property="fc:frame" content="vNext" />
<meta property="fc:frame:image" content="${BASE_URL}/api/og?creatorId=${creatorId}" />
<meta property="fc:frame:post_url" content="${BASE_URL}/api/frame?creatorId=${creatorId}" />
<meta property="fc:frame:button:1" content="Tip Creator" />`;
};

// Handle GET request
export async function GET(
  request: NextRequest,
  { params }: { params: { creatorId: string } }
) {
  try {
    const { creatorId } = params;
    
    // Get creator
    const { data: creator, error } = await creatorOperations.getById(creatorId);
    
    if (error || !creator) {
      return NextResponse.json(
        { error: 'Creator not found' },
        { status: 404 }
      );
    }
    
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'json';
    const width = searchParams.get('width') || '100%';
    const height = searchParams.get('height') || '400px';
    const theme = searchParams.get('theme') || 'light';
    
    // Generate embed code
    const embedCode = generateEmbedCode(creatorId, { width, height, theme });
    
    // Generate Farcaster frame code
    const farcasterFrameCode = generateFarcasterFrameCode(creatorId);
    
    // Return response based on format
    if (format === 'html') {
      return new NextResponse(embedCode, {
        headers: { 'Content-Type': 'text/html' },
      });
    } else if (format === 'farcaster') {
      return new NextResponse(farcasterFrameCode, {
        headers: { 'Content-Type': 'text/html' },
      });
    } else {
      return NextResponse.json({
        creator: {
          id: creator.id,
          username: creator.username,
          profileImageUrl: creator.profileImageUrl,
        },
        embedCode,
        farcasterFrameCode,
        widgetUrl: `${BASE_URL}/widget/${creatorId}`,
        frameUrl: `${BASE_URL}/api/frame?creatorId=${creatorId}`,
      });
    }
  } catch (error) {
    // Handle error
    const appError = handleApiError(error);
    console.error('Error generating widget:', appError);
    
    return NextResponse.json(
      { error: appError.message },
      { status: 500 }
    );
  }
}

