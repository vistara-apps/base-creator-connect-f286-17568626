/**
 * OpenGraph image API for Farcaster frames
 * 
 * This file generates OpenGraph images for Farcaster frames.
 */

import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import { creatorOperations } from '@/lib/supabase';

// Route segment config
export const runtime = 'edge';

// Font
const font = fetch(new URL('../../../public/Inter-Bold.ttf', import.meta.url)).then(
  (res) => res.arrayBuffer()
);

// Generate image
export async function GET(req: NextRequest) {
  try {
    const fontData = await font;
    
    // Get parameters from URL
    const { searchParams } = new URL(req.url);
    const creatorId = searchParams.get('creatorId');
    const amount = searchParams.get('amount');
    const state = searchParams.get('state') || 'initial';
    
    // Get creator
    let creatorName = 'Creator';
    let creatorImage = '';
    
    if (creatorId) {
      const { data: creator } = await creatorOperations.getById(creatorId);
      if (creator) {
        creatorName = creator.username || 'Creator';
        creatorImage = creator.profileImageUrl || '';
      }
    }
    
    // Generate title based on state
    let title = 'Tip Creator on Base';
    let subtitle = 'Support your favorite creators with ETH tips';
    
    switch (state) {
      case 'select_amount':
        title = 'Select Tip Amount';
        subtitle = 'Choose how much ETH to send';
        break;
      case 'custom_amount':
        title = 'Enter Custom Amount';
        subtitle = 'Type your preferred ETH amount';
        break;
      case 'add_message':
        title = 'Add a Message';
        subtitle = `Tipping ${amount} ETH`;
        break;
      case 'confirm':
        title = 'Confirm Your Tip';
        subtitle = `Send ${amount} ETH to ${creatorName}`;
        break;
      case 'success':
        title = 'Tip Sent Successfully!';
        subtitle = `You sent ${amount} ETH to ${creatorName}`;
        break;
      case 'error':
        title = 'Error Processing Tip';
        subtitle = 'Please try again';
        break;
    }
    
    // Generate image
    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            backgroundColor: '#0f172a',
            color: 'white',
            padding: 40,
            textAlign: 'center',
            fontFamily: 'Inter',
          }}
        >
          {/* Logo */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 20,
            }}
          >
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <rect width="48" height="48" rx="8" fill="#0052FF" />
              <path
                d="M24 8C15.164 8 8 15.164 8 24C8 32.836 15.164 40 24 40C32.836 40 40 32.836 40 24C40 15.164 32.836 8 24 8ZM24 36C17.373 36 12 30.627 12 24C12 17.373 17.373 12 24 12C30.627 12 36 17.373 36 24C36 30.627 30.627 36 24 36Z"
                fill="white"
              />
            </svg>
            <div
              style={{
                marginLeft: 12,
                fontSize: 24,
                fontWeight: 'bold',
              }}
            >
              Base Creator Connect
            </div>
          </div>
          
          {/* Creator image */}
          {creatorImage && (
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                overflow: 'hidden',
                marginBottom: 20,
                backgroundColor: '#1e293b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <img
                src={creatorImage}
                alt={creatorName}
                width={80}
                height={80}
                style={{ objectFit: 'cover' }}
              />
            </div>
          )}
          
          {/* Title */}
          <div
            style={{
              fontSize: 36,
              fontWeight: 'bold',
              marginBottom: 12,
            }}
          >
            {title}
          </div>
          
          {/* Subtitle */}
          <div
            style={{
              fontSize: 24,
              color: '#94a3b8',
              marginBottom: 24,
            }}
          >
            {subtitle}
          </div>
          
          {/* Amount (if applicable) */}
          {amount && state === 'confirm' && (
            <div
              style={{
                fontSize: 48,
                fontWeight: 'bold',
                color: '#0052FF',
                marginBottom: 24,
              }}
            >
              {amount} ETH
            </div>
          )}
          
          {/* Footer */}
          <div
            style={{
              position: 'absolute',
              bottom: 20,
              fontSize: 16,
              color: '#64748b',
            }}
          >
            Powered by Base Creator Connect
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: 'Inter',
            data: fontData,
            weight: 700,
            style: 'normal',
          },
        ],
      }
    );
  } catch (error) {
    console.error('Error generating OG image:', error);
    
    // Return a fallback image
    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            backgroundColor: '#0f172a',
            color: 'white',
            padding: 40,
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: 36, fontWeight: 'bold', marginBottom: 12 }}>
            Base Creator Connect
          </div>
          <div style={{ fontSize: 24, color: '#94a3b8' }}>
            Tip, connect, and grow with your fans on Base
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  }
}

