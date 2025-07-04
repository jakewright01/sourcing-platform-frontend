import { NextResponse } from 'next/server';

// Webhook handler for new seller listings
export async function POST(request) {
  try {
    const { listing_id, seller_id, item_name, item_description, price, category, tags } = await request.json();
    
    // Find matching buyer requests
    const matchingRequests = await findMatchingRequests({
      item_name,
      item_description,
      price,
      category,
      tags
    });
    
    // Notify buyers with matching requests
    for (const buyerRequest of matchingRequests) {
      await notifyBuyerOfNewMatch(buyerRequest, {
        listing_id,
        item_name,
        price,
        seller_id
      });
    }
    
    // Update seller's listing with match count
    await updateListingMatchCount(listing_id, matchingRequests.length);
    
    return NextResponse.json({
      success: true,
      message: 'Listing processed successfully',
      matches_found: matchingRequests.length
    });

  } catch (error) {
    console.error('New listing webhook error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to process new listing',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

async function findMatchingRequests(listing) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
    const response = await fetch(`${apiUrl}/requests/search-active`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        item_name: listing.item_name,
        item_description: listing.item_description,
        max_price: listing.price,
        category: listing.category
      })
    });
    
    if (response.ok) {
      const data = await response.json();
      return data.filter(request => {
        // Additional filtering logic
        const budgetMatch = !request.budget || listing.price <= request.budget;
        const textMatch = calculateTextSimilarity(
          listing.item_name + ' ' + listing.item_description,
          request.request_description
        ) > 0.3;
        
        return budgetMatch && textMatch;
      });
    }
  } catch (error) {
    console.error('Error finding matching requests:', error);
  }
  
  return [];
}

async function notifyBuyerOfNewMatch(buyerRequest, listing) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
    await fetch(`${apiUrl}/notifications/buyer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        buyer_id: buyerRequest.buyer_id,
        request_id: buyerRequest.id,
        message: `New listing matches your request: ${listing.item_name} - £${listing.price}`,
        type: 'new_match',
        listing_id: listing.listing_id
      })
    });
  } catch (error) {
    console.error('Error notifying buyer:', error);
  }
}

async function updateListingMatchCount(listingId, matchCount) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
    await fetch(`${apiUrl}/listings/${listingId}/update-matches`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ match_count: matchCount })
    });
  } catch (error) {
    console.error('Error updating listing match count:', error);
  }
}

function calculateTextSimilarity(text1, text2) {
  if (!text1 || !text2) return 0;
  
  const words1 = text1.toLowerCase().split(/\s+/);
  const words2 = text2.toLowerCase().split(/\s+/);
  
  const intersection = words1.filter(word => words2.includes(word));
  const union = [...new Set([...words1, ...words2])];
  
  return intersection.length / union.length;
}