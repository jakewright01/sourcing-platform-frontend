import { NextResponse } from 'next/server';

// AI-powered matching engine that combines internal listings with third-party results
export async function POST(request) {
  try {
    const { requestId, searchQuery, budget, category, preferences } = await request.json();
    
    // Step 1: Search internal listings
    const internalMatches = await searchInternalListings(searchQuery, budget, category);
    
    // Step 2: Search third-party platforms
    const thirdPartyMatches = await searchThirdPartyPlatforms(searchQuery, budget, category);
    
    // Step 3: Apply AI scoring and ranking
    const allMatches = [...internalMatches, ...thirdPartyMatches];
    const scoredMatches = await applyAIScoring(allMatches, searchQuery, preferences);
    
    // Step 4: Sort by relevance score
    const rankedMatches = scoredMatches.sort((a, b) => b.ai_score - a.ai_score);
    
    // Step 5: Store matches for the request
    await storeMatches(requestId, rankedMatches);
    
    return NextResponse.json({
      success: true,
      request_id: requestId,
      total_matches: rankedMatches.length,
      internal_matches: internalMatches.length,
      external_matches: thirdPartyMatches.length,
      matches: rankedMatches.slice(0, 20) // Return top 20 matches
    });

  } catch (error) {
    console.error('AI matching engine error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'AI matching failed',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

async function searchInternalListings(searchQuery, budget, category) {
  try {
    // Search our internal database
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
    const response = await fetch(`${apiUrl}/listings/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: searchQuery,
        max_price: budget,
        category: category
      })
    });
    
    if (response.ok) {
      const data = await response.json();
      return data.map(item => ({
        ...item,
        source: 'internal',
        priority_score: 1.2 // Boost internal listings
      }));
    }
  } catch (error) {
    console.error('Internal search error:', error);
  }
  
  return [];
}

async function searchThirdPartyPlatforms(searchQuery, budget, category) {
  const allResults = [];
  
  // Search eBay
  try {
    const ebayResponse = await fetch('/api/integrations/ebay', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        searchQuery,
        maxPrice: budget,
        category
      })
    });
    
    if (ebayResponse.ok) {
      const ebayData = await ebayResponse.json();
      if (ebayData.success) {
        allResults.push(...ebayData.items);
      }
    }
  } catch (error) {
    console.error('eBay search error:', error);
  }
  
  // Search Depop (for fashion items)
  if (category === 'fashion' || !category) {
    try {
      const depopResponse = await fetch('/api/integrations/depop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          searchQuery,
          maxPrice: budget,
          category
        })
      });
      
      if (depopResponse.ok) {
        const depopData = await depopResponse.json();
        if (depopData.success) {
          allResults.push(...depopData.items);
        }
      }
    } catch (error) {
      console.error('Depop search error:', error);
    }
  }
  
  // Search Vinted (for fashion items)
  if (category === 'fashion' || !category) {
    try {
      const vintedResponse = await fetch('/api/integrations/vinted', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          searchQuery,
          maxPrice: budget,
          category
        })
      });
      
      if (vintedResponse.ok) {
        const vintedData = await vintedResponse.json();
        if (vintedData.success) {
          allResults.push(...vintedData.items);
        }
      }
    } catch (error) {
      console.error('Vinted search error:', error);
    }
  }
  
  return allResults;
}

async function applyAIScoring(matches, searchQuery, preferences = {}) {
  return matches.map(match => {
    let score = 0;
    
    // Text similarity scoring
    const titleSimilarity = calculateTextSimilarity(searchQuery, match.item_name);
    const descriptionSimilarity = calculateTextSimilarity(searchQuery, match.item_description || '');
    score += (titleSimilarity * 0.6) + (descriptionSimilarity * 0.3);
    
    // Price scoring (closer to budget gets higher score)
    if (preferences.budget) {
      const priceRatio = match.price / preferences.budget;
      if (priceRatio <= 1) {
        score += (1 - priceRatio) * 0.2;
      } else {
        score -= (priceRatio - 1) * 0.3; // Penalty for over budget
      }
    }
    
    // Source priority (internal listings get boost)
    if (match.priority_score) {
      score *= match.priority_score;
    }
    
    // Condition scoring
    const conditionScores = {
      'New': 1.0,
      'Used - Like New': 0.9,
      'Used - Good': 0.8,
      'Used - Fair': 0.6
    };
    score *= (conditionScores[match.condition] || 0.7);
    
    // Seller reputation (if available)
    if (match.seller_info?.rating) {
      score *= (match.seller_info.rating / 5);
    }
    
    return {
      ...match,
      ai_score: Math.min(Math.max(score, 0), 1) // Normalize between 0 and 1
    };
  });
}

function calculateTextSimilarity(text1, text2) {
  if (!text1 || !text2) return 0;
  
  const words1 = text1.toLowerCase().split(/\s+/);
  const words2 = text2.toLowerCase().split(/\s+/);
  
  const intersection = words1.filter(word => words2.includes(word));
  const union = [...new Set([...words1, ...words2])];
  
  return intersection.length / union.length;
}

async function storeMatches(requestId, matches) {
  try {
    // Store matches in database for later retrieval
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
    await fetch(`${apiUrl}/requests/${requestId}/matches`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ matches })
    });
  } catch (error) {
    console.error('Error storing matches:', error);
  }
}