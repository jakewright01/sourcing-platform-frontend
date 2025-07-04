import { NextResponse } from 'next/server';

// eBay API integration for third-party sourcing
export async function POST(request) {
  try {
    const { searchQuery, maxPrice, category } = await request.json();
    
    // eBay API configuration
    const ebayConfig = {
      appId: process.env.EBAY_APP_ID,
      certId: process.env.EBAY_CERT_ID,
      devId: process.env.EBAY_DEV_ID,
      userToken: process.env.EBAY_USER_TOKEN,
      sandbox: process.env.NODE_ENV !== 'production'
    };

    const ebayEndpoint = ebayConfig.sandbox 
      ? 'https://api.sandbox.ebay.com/ws/api.dll'
      : 'https://api.ebay.com/ws/api.dll';

    // Build eBay API request
    const ebayRequest = `
      <?xml version="1.0" encoding="utf-8"?>
      <FindItemsAdvancedRequest xmlns="urn:ebay:apis:eBLBaseComponents">
        <RequesterCredentials>
          <eBayAuthToken>${ebayConfig.userToken}</eBayAuthToken>
        </RequesterCredentials>
        <keywords>${searchQuery}</keywords>
        <itemFilter>
          <name>MaxPrice</name>
          <value>${maxPrice}</value>
        </itemFilter>
        <itemFilter>
          <name>ListingType</name>
          <value>FixedPrice</value>
        </itemFilter>
        <itemFilter>
          <name>Condition</name>
          <value>New</value>
        </itemFilter>
        <itemFilter>
          <name>Condition</name>
          <value>Used</value>
        </itemFilter>
        <sortOrder>PricePlusShippingLowest</sortOrder>
        <paginationInput>
          <entriesPerPage>20</entriesPerPage>
          <pageNumber>1</pageNumber>
        </paginationInput>
        <outputSelector>AspectHistogram</outputSelector>
        <outputSelector>CategoryHistogram</outputSelector>
        <outputSelector>ConditionHistogram</outputSelector>
        <outputSelector>GalleryInfo</outputSelector>
      </FindItemsAdvancedRequest>
    `;

    const response = await fetch(ebayEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/xml',
        'X-EBAY-API-COMPATIBILITY-LEVEL': '967',
        'X-EBAY-API-CALL-NAME': 'FindItemsAdvanced',
        'X-EBAY-API-SITEID': '3', // UK site
        'X-EBAY-API-APP-ID': ebayConfig.appId,
        'X-EBAY-API-DEV-ID': ebayConfig.devId,
        'X-EBAY-API-CERT-ID': ebayConfig.certId,
      },
      body: ebayRequest
    });

    if (!response.ok) {
      throw new Error(`eBay API error: ${response.status}`);
    }

    const xmlData = await response.text();
    
    // Parse XML response (simplified - in production use proper XML parser)
    const items = parseEbayResponse(xmlData);
    
    // Transform to our standard format
    const standardizedItems = items.map(item => ({
      id: `ebay_${item.itemId}`,
      item_name: item.title,
      item_description: item.subtitle || '',
      price: parseFloat(item.currentPrice),
      condition: item.condition,
      source: 'ebay',
      external_url: item.viewItemURL,
      image_url: item.galleryURL,
      seller_info: {
        username: item.sellerUserName,
        feedback_score: item.feedbackScore
      },
      location: item.location,
      shipping_cost: parseFloat(item.shippingCost || 0),
      end_time: item.endTime
    }));

    return NextResponse.json({
      success: true,
      source: 'ebay',
      total_results: standardizedItems.length,
      items: standardizedItems
    });

  } catch (error) {
    console.error('eBay integration error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to search eBay',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

// Simplified XML parser for eBay response
function parseEbayResponse(xmlData) {
  // In production, use a proper XML parser like xml2js
  // This is a simplified implementation for demonstration
  const items = [];
  
  try {
    // Extract items from XML (simplified regex approach)
    const itemMatches = xmlData.match(/<item>[\s\S]*?<\/item>/g) || [];
    
    itemMatches.forEach(itemXml => {
      const item = {
        itemId: extractXmlValue(itemXml, 'itemId'),
        title: extractXmlValue(itemXml, 'title'),
        subtitle: extractXmlValue(itemXml, 'subtitle'),
        currentPrice: extractXmlValue(itemXml, 'currentPrice'),
        condition: extractXmlValue(itemXml, 'conditionDisplayName'),
        viewItemURL: extractXmlValue(itemXml, 'viewItemURL'),
        galleryURL: extractXmlValue(itemXml, 'galleryURL'),
        sellerUserName: extractXmlValue(itemXml, 'sellerUserName'),
        feedbackScore: extractXmlValue(itemXml, 'feedbackScore'),
        location: extractXmlValue(itemXml, 'location'),
        shippingCost: extractXmlValue(itemXml, 'shippingServiceCost'),
        endTime: extractXmlValue(itemXml, 'endTime')
      };
      
      if (item.itemId && item.title) {
        items.push(item);
      }
    });
  } catch (error) {
    console.error('XML parsing error:', error);
  }
  
  return items;
}

function extractXmlValue(xml, tagName) {
  const regex = new RegExp(`<${tagName}[^>]*>([^<]*)<\/${tagName}>`, 'i');
  const match = xml.match(regex);
  return match ? match[1].trim() : '';
}