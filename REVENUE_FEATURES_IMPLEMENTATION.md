# 💰 Revenue Features Implementation Guide

## Subscription Tiers System

### 1. Database Schema for Subscriptions
```sql
-- Add to your Supabase database
ALTER TABLE user_profiles ADD COLUMN subscription_tier TEXT DEFAULT 'free';
ALTER TABLE user_profiles ADD COLUMN subscription_expires_at TIMESTAMPTZ;
ALTER TABLE user_profiles ADD COLUMN monthly_requests_used INTEGER DEFAULT 0;
ALTER TABLE user_profiles ADD COLUMN stripe_customer_id TEXT;

-- Subscription limits table
CREATE TABLE subscription_limits (
  tier TEXT PRIMARY KEY,
  monthly_requests INTEGER,
  price_monthly DECIMAL(10,2),
  features TEXT[]
);

INSERT INTO subscription_limits VALUES
('free', 3, 0.00, ARRAY['Basic matching', 'Email support']),
('pro', -1, 19.99, ARRAY['Unlimited requests', 'AI matching', 'Priority support']),
('business', -1, 49.99, ARRAY['Everything in Pro', 'API access', 'Analytics', 'White-label']);
```

### 2. Subscription Component
```javascript
// src/components/SubscriptionTiers.js
export default function SubscriptionTiers() {
  const tiers = [
    {
      name: 'Free',
      price: 0,
      requests: 3,
      features: ['3 requests/month', 'Basic matching', 'Email support']
    },
    {
      name: 'Professional',
      price: 19.99,
      requests: 'Unlimited',
      features: ['Unlimited requests', 'AI-powered matching', 'Priority support', 'Real-time notifications'],
      popular: true
    },
    {
      name: 'Business',
      price: 49.99,
      requests: 'Unlimited',
      features: ['Everything in Pro', 'API access', 'Advanced analytics', 'White-label options']
    }
  ];

  return (
    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
      {tiers.map((tier) => (
        <div key={tier.name} className={`relative bg-white rounded-2xl shadow-lg border-2 p-8 ${tier.popular ? 'border-blue-500' : 'border-gray-200'}`}>
          {tier.popular && (
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                Most Popular
              </span>
            </div>
          )}
          
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{tier.name}</h3>
            <div className="mb-4">
              <span className="text-4xl font-bold text-gray-900">£{tier.price}</span>
              <span className="text-gray-600">/month</span>
            </div>
            <p className="text-gray-600 mb-6">{tier.requests} sourcing requests</p>
          </div>

          <ul className="space-y-3 mb-8">
            {tier.features.map((feature, index) => (
              <li key={index} className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700">{feature}</span>
              </li>
            ))}
          </ul>

          <button className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
            tier.popular 
              ? 'bg-blue-600 hover:bg-blue-700 text-white' 
              : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
          }`}>
            {tier.price === 0 ? 'Get Started' : 'Upgrade Now'}
          </button>
        </div>
      ))}
    </div>
  );
}
```

## Commission System

### 1. Transaction Tracking
```javascript
// src/lib/revenue.js
export const calculateCommission = (salePrice, userTier = 'free') => {
  const commissionRates = {
    free: 0.05,      // 5%
    pro: 0.03,       // 3%
    business: 0.02   // 2%
  };
  
  return salePrice * commissionRates[userTier];
};

export const recordTransaction = async (transactionData) => {
  const { data, error } = await supabase
    .from('transactions')
    .insert([{
      buyer_id: transactionData.buyer_id,
      seller_id: transactionData.seller_id,
      listing_id: transactionData.listing_id,
      amount: transactionData.amount,
      commission: calculateCommission(transactionData.amount, transactionData.seller_tier),
      status: 'completed'
    }]);
    
  return { data, error };
};
```

### 2. Revenue Dashboard
```javascript
// src/app/admin/revenue/page.js
export default function RevenueDashboard() {
  const [revenueData, setRevenueData] = useState({
    totalRevenue: 0,
    monthlyRevenue: 0,
    subscriptionRevenue: 0,
    commissionRevenue: 0,
    totalTransactions: 0
  });

  useEffect(() => {
    fetchRevenueData();
  }, []);

  const fetchRevenueData = async () => {
    // Fetch from Supabase
    const { data: transactions } = await supabase
      .from('transactions')
      .select('*');
      
    const { data: subscriptions } = await supabase
      .from('user_profiles')
      .select('subscription_tier')
      .neq('subscription_tier', 'free');

    // Calculate metrics
    const totalRevenue = transactions?.reduce((sum, t) => sum + t.commission, 0) || 0;
    const subscriptionRevenue = subscriptions?.length * 19.99 || 0; // Simplified
    
    setRevenueData({
      totalRevenue: totalRevenue + subscriptionRevenue,
      monthlyRevenue: subscriptionRevenue,
      commissionRevenue: totalRevenue,
      subscriptionRevenue,
      totalTransactions: transactions?.length || 0
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Revenue Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg p-6 shadow">
          <h3 className="text-lg font-medium text-gray-900">Total Revenue</h3>
          <p className="text-3xl font-bold text-green-600">£{revenueData.totalRevenue.toFixed(2)}</p>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow">
          <h3 className="text-lg font-medium text-gray-900">Monthly Subscriptions</h3>
          <p className="text-3xl font-bold text-blue-600">£{revenueData.subscriptionRevenue.toFixed(2)}</p>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow">
          <h3 className="text-lg font-medium text-gray-900">Commission Revenue</h3>
          <p className="text-3xl font-bold text-purple-600">£{revenueData.commissionRevenue.toFixed(2)}</p>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow">
          <h3 className="text-lg font-medium text-gray-900">Total Transactions</h3>
          <p className="text-3xl font-bold text-gray-900">{revenueData.totalTransactions}</p>
        </div>
      </div>
    </div>
  );
}
```

## B2B API Revenue

### 1. API Key Management
```javascript
// src/lib/apiKeys.js
export const generateApiKey = () => {
  return 'sk_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

export const validateApiKey = async (apiKey) => {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('api_key', apiKey)
    .single();
    
  return { user: data, error };
};
```

### 2. API Pricing Structure
```javascript
// src/lib/apiPricing.js
export const API_PRICING = {
  requests: 0.10,      // £0.10 per API request
  matches: 0.05,       // £0.05 per match returned
  webhooks: 0.01,      // £0.01 per webhook
  bulk_requests: 0.08  // £0.08 per request in bulk (100+)
};

export const calculateApiCost = (requestType, quantity) => {
  const basePrice = API_PRICING[requestType] || 0.10;
  
  // Volume discounts
  if (quantity >= 1000) {
    return basePrice * quantity * 0.8; // 20% discount
  } else if (quantity >= 100) {
    return basePrice * quantity * 0.9; // 10% discount
  }
  
  return basePrice * quantity;
};
```

### 3. API Documentation Page
```javascript
// src/app/api-docs/page.js
export default function ApiDocsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">SourceMe API Documentation</h1>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-bold text-blue-900 mb-2">Pricing</h2>
        <ul className="text-blue-800 space-y-1">
          <li>• API Requests: £0.10 each</li>
          <li>• Match Results: £0.05 each</li>
          <li>• Webhooks: £0.01 each</li>
          <li>• Volume discounts available</li>
        </ul>
      </div>

      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-bold mb-4">Authentication</h2>
          <div className="bg-gray-100 rounded-lg p-4">
            <code>Authorization: Bearer YOUR_API_KEY</code>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Submit Sourcing Request</h2>
          <div className="bg-gray-100 rounded-lg p-4 mb-4">
            <code>POST /api/v1/requests</code>
          </div>
          <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
{`{
  "description": "Looking for vintage Barbour jacket",
  "budget": 150,
  "category": "fashion",
  "webhook_url": "https://your-site.com/webhook"
}`}
          </pre>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Get Matches</h2>
          <div className="bg-gray-100 rounded-lg p-4 mb-4">
            <code>GET /api/v1/requests/{'{request_id}'}/matches</code>
          </div>
          <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
{`{
  "request_id": "req_123",
  "total_matches": 15,
  "matches": [
    {
      "id": "match_1",
      "item_name": "Vintage Barbour Jacket",
      "price": 125.00,
      "condition": "Used - Good",
      "ai_score": 0.95,
      "source": "internal"
    }
  ]
}`}
          </pre>
        </section>
      </div>
    </div>
  );
}
```

## Revenue Projections

### Month 1: £1,000-2,000
- **Subscriptions**: 20 Pro users × £19.99 = £400
- **Commissions**: 50 transactions × £5 avg = £250
- **API Revenue**: 1,000 requests × £0.10 = £100
- **Total**: £750-1,500

### Month 3: £5,000-10,000
- **Subscriptions**: 100 Pro + 20 Business = £3,000
- **Commissions**: 200 transactions × £10 avg = £2,000
- **API Revenue**: 10,000 requests × £0.10 = £1,000
- **Total**: £6,000-8,000

### Month 6: £15,000-25,000
- **Subscriptions**: 300 Pro + 50 Business = £8,500
- **Commissions**: 500 transactions × £15 avg = £7,500
- **API Revenue**: 50,000 requests × £0.08 = £4,000
- **Total**: £20,000+

## Implementation Priority

1. **Week 1**: Subscription tiers + Stripe integration
2. **Week 2**: Commission tracking system
3. **Week 3**: B2B API endpoints
4. **Week 4**: Revenue dashboard + analytics

Your platform is perfectly positioned to generate significant revenue! 🚀💰