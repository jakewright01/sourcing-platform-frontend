import { NextResponse } from 'next/server';

// Webhook handler for new sourcing requests
export async function POST(request) {
  try {
    const { request_id, buyer_id, request_description, budget, category } = await request.json();
    
    // Trigger AI matching engine
    const matchingResponse = await fetch('/api/ai/match-engine', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        requestId: request_id,
        searchQuery: request_description,
        budget: budget,
        category: category,
        preferences: {
          budget: budget
        }
      })
    });
    
    if (!matchingResponse.ok) {
      throw new Error('Failed to trigger AI matching');
    }
    
    const matchingData = await matchingResponse.json();
    
    // Notify relevant sellers about potential matches
    await notifySellers(matchingData.matches);
    
    // Send confirmation to buyer
    await notifyBuyer(buyer_id, request_id, matchingData.total_matches);
    
    return NextResponse.json({
      success: true,
      message: 'Request processed successfully',
      matches_found: matchingData.total_matches
    });

  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to process request',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

async function notifySellers(matches) {
  // Notify sellers who have matching items
  const internalMatches = matches.filter(match => match.source === 'internal');
  
  for (const match of internalMatches) {
    try {
      // Send notification to seller
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
      await fetch(`${apiUrl}/notifications/seller`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          seller_id: match.seller_id,
          listing_id: match.id,
          message: 'Your listing has been matched with a buyer request!',
          type: 'match_found'
        })
      });
    } catch (error) {
      console.error('Error notifying seller:', error);
    }
  }
}

async function notifyBuyer(buyerId, requestId, totalMatches) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
    await fetch(`${apiUrl}/notifications/buyer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        buyer_id: buyerId,
        request_id: requestId,
        message: `We found ${totalMatches} potential matches for your request!`,
        type: 'matches_found'
      })
    });
  } catch (error) {
    console.error('Error notifying buyer:', error);
  }
}