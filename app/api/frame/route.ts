/**
 * Farcaster Frame API for Base Creator Connect
 * 
 * This file implements the Farcaster Frame API for tipping creators.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getFrameMessage, FrameRequest, FrameButtonId } from '@farcaster/frame-sdk';
import { creatorOperations, tipOperations } from '@/lib/supabase';
import { parseEther } from 'viem';
import { DEFAULT_TIP_AMOUNTS } from '@/lib/transactions';
import { generateThankYouNote } from '@/lib/ai';

// Base URL for the app
const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://base-creator-connect.vercel.app';

// Frame states
enum FrameState {
  INITIAL = 'initial',
  SELECT_AMOUNT = 'select_amount',
  CUSTOM_AMOUNT = 'custom_amount',
  ADD_MESSAGE = 'add_message',
  CONFIRM = 'confirm',
  SUCCESS = 'success',
  ERROR = 'error'
}

// Frame data
interface FrameData {
  state: FrameState;
  creatorId?: string;
  amount?: string;
  message?: string;
  transactionHash?: string;
  error?: string;
}

// Parse frame data from state
const parseFrameData = (state: string | null): FrameData => {
  if (!state) {
    return { state: FrameState.INITIAL };
  }
  
  try {
    return JSON.parse(decodeURIComponent(state)) as FrameData;
  } catch (error) {
    console.error('Error parsing frame data:', error);
    return { state: FrameState.INITIAL };
  }
};

// Create frame response
const createFrameResponse = (
  frameData: FrameData,
  imageUrl: string,
  buttons: Array<{ text: string; action?: string; target?: string }>
) => {
  // Serialize frame data
  const serializedData = encodeURIComponent(JSON.stringify(frameData));
  
  // Create frame response
  return new NextResponse(
    `<!DOCTYPE html>
    <html>
      <head>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="${imageUrl}" />
        <meta property="fc:frame:post_url" content="${BASE_URL}/api/frame?state=${serializedData}" />
        ${buttons.map((button, index) => {
          const buttonProps = [];
          buttonProps.push(`fc:frame:button:${index + 1} content="${button.text}"`);
          
          if (button.action) {
            buttonProps.push(`fc:frame:button:${index + 1}:action content="${button.action}"`);
          }
          
          if (button.target) {
            buttonProps.push(`fc:frame:button:${index + 1}:target content="${button.target}"`);
          }
          
          return buttonProps.map(prop => `<meta property="${prop}" />`).join('\n        ');
        }).join('\n        ')}
      </head>
    </html>`,
    {
      status: 200,
      headers: {
        'Content-Type': 'text/html',
      },
    }
  );
};

// Initial frame
const initialFrame = (creatorId: string) => {
  return createFrameResponse(
    { state: FrameState.SELECT_AMOUNT, creatorId },
    `${BASE_URL}/api/og?creatorId=${creatorId}`,
    [
      { text: `${DEFAULT_TIP_AMOUNTS[0]} ETH` },
      { text: `${DEFAULT_TIP_AMOUNTS[1]} ETH` },
      { text: `${DEFAULT_TIP_AMOUNTS[2]} ETH` },
      { text: 'Custom Amount' }
    ]
  );
};

// Select amount frame
const selectAmountFrame = (frameData: FrameData) => {
  const { creatorId } = frameData;
  
  return createFrameResponse(
    { state: FrameState.SELECT_AMOUNT, creatorId },
    `${BASE_URL}/api/og?creatorId=${creatorId}&state=select_amount`,
    [
      { text: `${DEFAULT_TIP_AMOUNTS[0]} ETH` },
      { text: `${DEFAULT_TIP_AMOUNTS[1]} ETH` },
      { text: `${DEFAULT_TIP_AMOUNTS[2]} ETH` },
      { text: 'Custom Amount' }
    ]
  );
};

// Custom amount frame
const customAmountFrame = (frameData: FrameData) => {
  const { creatorId } = frameData;
  
  return createFrameResponse(
    { state: FrameState.CUSTOM_AMOUNT, creatorId },
    `${BASE_URL}/api/og?creatorId=${creatorId}&state=custom_amount`,
    [
      { text: 'Input Amount', action: 'input_text' },
      { text: 'Back' }
    ]
  );
};

// Add message frame
const addMessageFrame = (frameData: FrameData) => {
  const { creatorId, amount } = frameData;
  
  return createFrameResponse(
    { state: FrameState.ADD_MESSAGE, creatorId, amount },
    `${BASE_URL}/api/og?creatorId=${creatorId}&amount=${amount}&state=add_message`,
    [
      { text: 'Add Message', action: 'input_text' },
      { text: 'Skip' },
      { text: 'Back' }
    ]
  );
};

// Confirm frame
const confirmFrame = (frameData: FrameData) => {
  const { creatorId, amount, message } = frameData;
  
  return createFrameResponse(
    { state: FrameState.CONFIRM, creatorId, amount, message },
    `${BASE_URL}/api/og?creatorId=${creatorId}&amount=${amount}&state=confirm`,
    [
      { text: 'Confirm Tip' },
      { text: 'Back' }
    ]
  );
};

// Success frame
const successFrame = (frameData: FrameData) => {
  const { creatorId, amount, transactionHash } = frameData;
  
  return createFrameResponse(
    { state: FrameState.SUCCESS, creatorId, amount, transactionHash },
    `${BASE_URL}/api/og?creatorId=${creatorId}&amount=${amount}&state=success`,
    [
      { text: 'View Transaction', action: 'link', target: `https://basescan.org/tx/${transactionHash}` },
      { text: 'Tip Again' }
    ]
  );
};

// Error frame
const errorFrame = (frameData: FrameData) => {
  const { creatorId, error } = frameData;
  
  return createFrameResponse(
    { state: FrameState.ERROR, creatorId, error },
    `${BASE_URL}/api/og?creatorId=${creatorId}&state=error`,
    [
      { text: 'Try Again' }
    ]
  );
};

// Handle frame request
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    // Get frame message
    const body = await req.json();
    const { isValid, message } = await getFrameMessage(body);
    
    if (!isValid || !message) {
      return errorFrame({ state: FrameState.ERROR, error: 'Invalid frame message' });
    }
    
    // Parse state from URL
    const url = new URL(req.url);
    const state = url.searchParams.get('state');
    const frameData = parseFrameData(state);
    
    // Handle button click
    const buttonId = message.button as FrameButtonId;
    
    switch (frameData.state) {
      case FrameState.INITIAL: {
        // Get creator ID from URL
        const creatorId = url.searchParams.get('creatorId');
        if (!creatorId) {
          return errorFrame({ state: FrameState.ERROR, error: 'Creator ID is required' });
        }
        
        return initialFrame(creatorId);
      }
      
      case FrameState.SELECT_AMOUNT: {
        if (buttonId === 4) {
          // Custom amount
          return customAmountFrame(frameData);
        } else if (buttonId >= 1 && buttonId <= 3) {
          // Predefined amount
          const amount = DEFAULT_TIP_AMOUNTS[buttonId - 1];
          return addMessageFrame({ ...frameData, amount });
        }
        
        return selectAmountFrame(frameData);
      }
      
      case FrameState.CUSTOM_AMOUNT: {
        if (buttonId === 1 && message.inputText) {
          // Validate amount
          try {
            const amount = parseFloat(message.inputText);
            if (isNaN(amount) || amount <= 0) {
              return errorFrame({ ...frameData, error: 'Invalid amount' });
            }
            
            return addMessageFrame({ ...frameData, amount: amount.toString() });
          } catch (error) {
            return errorFrame({ ...frameData, error: 'Invalid amount' });
          }
        } else if (buttonId === 2) {
          // Back
          return selectAmountFrame(frameData);
        }
        
        return customAmountFrame(frameData);
      }
      
      case FrameState.ADD_MESSAGE: {
        if (buttonId === 1) {
          // Add message
          const message = message.inputText || '';
          return confirmFrame({ ...frameData, message });
        } else if (buttonId === 2) {
          // Skip
          return confirmFrame({ ...frameData, message: '' });
        } else if (buttonId === 3) {
          // Back
          return selectAmountFrame(frameData);
        }
        
        return addMessageFrame(frameData);
      }
      
      case FrameState.CONFIRM: {
        if (buttonId === 1) {
          // Confirm tip
          try {
            // Get creator
            const { data: creator } = await creatorOperations.getById(frameData.creatorId!);
            if (!creator) {
              return errorFrame({ ...frameData, error: 'Creator not found' });
            }
            
            // Create tip
            const tip = {
              creatorId: creator.id,
              fanWalletAddress: message.requesterFid?.toString() || 'unknown',
              amount: parseFloat(frameData.amount!),
              currency: 'ETH',
              message: frameData.message,
              transactionHash: `frame-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            };
            
            const { data: createdTip } = await tipOperations.create(tip);
            if (!createdTip) {
              return errorFrame({ ...frameData, error: 'Failed to create tip' });
            }
            
            // Generate thank-you note
            const thankYouNote = await generateThankYouNote(
              frameData.message || '',
              frameData.amount!
            );
            
            // Return success frame
            return successFrame({
              ...frameData,
              transactionHash: createdTip.transactionHash
            });
          } catch (error) {
            console.error('Error processing tip:', error);
            return errorFrame({ ...frameData, error: 'Failed to process tip' });
          }
        } else if (buttonId === 2) {
          // Back
          return addMessageFrame(frameData);
        }
        
        return confirmFrame(frameData);
      }
      
      case FrameState.SUCCESS: {
        if (buttonId === 2) {
          // Tip again
          return selectAmountFrame({ state: FrameState.SELECT_AMOUNT, creatorId: frameData.creatorId });
        }
        
        return successFrame(frameData);
      }
      
      case FrameState.ERROR: {
        if (buttonId === 1) {
          // Try again
          return selectAmountFrame({ state: FrameState.SELECT_AMOUNT, creatorId: frameData.creatorId });
        }
        
        return errorFrame(frameData);
      }
      
      default:
        return initialFrame(frameData.creatorId || '');
    }
  } catch (error) {
    console.error('Frame error:', error);
    return errorFrame({ state: FrameState.ERROR, error: 'An unexpected error occurred' });
  }
}

// Handle GET request (initial frame)
export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const url = new URL(req.url);
    const creatorId = url.searchParams.get('creatorId');
    
    if (!creatorId) {
      return errorFrame({ state: FrameState.ERROR, error: 'Creator ID is required' });
    }
    
    return initialFrame(creatorId);
  } catch (error) {
    console.error('Frame error:', error);
    return errorFrame({ state: FrameState.ERROR, error: 'An unexpected error occurred' });
  }
}

