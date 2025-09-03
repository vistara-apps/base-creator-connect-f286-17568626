import { NextRequest, NextResponse } from 'next/server';
import { getCachedOrGenerateThankYouNote, ThankYouStyle } from '@/lib/ai';
import { tierOperations } from '@/lib/supabase';
import { handleApiError } from '@/lib/error';

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const { message, amount, tierId, style } = await request.json();
    
    // Validate required fields
    if (!amount) {
      return NextResponse.json(
        { error: 'Amount is required' },
        { status: 400 }
      );
    }
    
    // Get tier name if tierId is provided
    let tierName: string | undefined;
    if (tierId) {
      const { data: tier } = await tierOperations.getById(tierId);
      if (tier) {
        tierName = tier.name;
      }
    }
    
    // Generate thank-you note
    const note = await getCachedOrGenerateThankYouNote(
      message || '',
      amount,
      tierName,
      style || ThankYouStyle.GRATEFUL
    );
    
    // Return thank-you note
    return NextResponse.json({ note });
  } catch (error) {
    // Handle error
    const appError = handleApiError(error);
    console.error('Error generating thank-you note:', appError);
    
    return NextResponse.json(
      { error: appError.message },
      { status: 500 }
    );
  }
}
