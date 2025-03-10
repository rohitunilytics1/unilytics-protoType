// server.js - Improved with better mock responses
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// DeepSeek API endpoint
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;

// Improved mock responses with actual data insights
const getMockResponse = (userMessage) => {
  // Clean up the user message for matching
  const normalizedUserMessage = userMessage.toLowerCase().trim();
  
  // Performance insights
  if (normalizedUserMessage.includes('performance insights') || normalizedUserMessage.includes('weekly reports')) {
    return `Based on the campaign performance data from Nov 25 to Dec 1, 2024, here are the key insights:

1. **Overall Performance**: 
   - Total impressions: 1.2M (+18% week-over-week)
   - Total clicks: 38,240 (+12% week-over-week)
   - Total conversions: 1,876 (+7% week-over-week)
   - Average CPC: $0.42 (-5% week-over-week)

2. **Campaign Breakdown**:
   - The "Holiday Special" campaign had the highest ROI at 320%
   - "Product Awareness" campaign saw the biggest improvement with CTR increasing from 2.1% to 3.4%
   - "Retargeting" campaign continues to be the most cost-effective with CPA at $12.40

3. **Key Patterns**:
   - Tuesday and Wednesday showed peak engagement across all campaigns
   - Mobile conversions increased by 22% while desktop conversions remained flat
   - Evening hours (6-9 PM) outperformed all other time slots

Would you like me to generate a visualization for any specific aspect of this data?`;
  }
  
  // Budget allocation
  else if (normalizedUserMessage.includes('budget') || normalizedUserMessage.includes('allocation') || normalizedUserMessage.includes('$1000')) {
    return `Based on the performance data from Nov 25 to Dec 1, 2024, here's how I recommend allocating the extra $1,000 budget:

1. **Product Awareness Campaign: $450 (45%)**
   - This campaign has shown the highest growth potential with CTR increasing from 2.1% to 3.4%
   - Additional investment here will likely result in 15-20% more conversions
   - Recommend focusing on mobile placements during evening hours (6-9 PM)

2. **Holiday Special Campaign: $350 (35%)**
   - Currently your highest ROI campaign at 320%
   - Additional investment can capitalize on seasonal interest
   - Recommend expanding keyword targeting to related gift categories

3. **Retargeting Campaign: $200 (20%)**
   - Your most cost-effective campaign with CPA at $12.40
   - Additional investment here will help convert users who have shown interest
   - Recommend creating new ad variants to prevent creative fatigue

I can provide more detailed projections for each allocation if you'd like. Would you like to see estimated ROI for this budget distribution?`;
  }
  
  // Asset performance
  else if (normalizedUserMessage.includes('assets') || normalizedUserMessage.includes('performing best')) {
    return `Based on key metrics from Nov 25 to Dec 1, 2024, here's the performance breakdown of your assets:

1. **Top Performing Assets**:
   - Video Ad "Product Demo V3" - 4.2% CTR, 8.7% conversion rate
   - Carousel Ad "Holiday Collection" - 3.8% CTR, 7.2% conversion rate
   - Dynamic Product Ad "Personalized Offers" - 3.5% CTR, 9.1% conversion rate

2. **Performance Metrics Comparison**:
   - Video ads outperform static images by 68% in engagement rate
   - User testimonial content drives 42% higher conversion rates than product-focused content
   - Mobile-optimized assets have 37% better performance than non-optimized assets

3. **Underperforming Assets**:
   - Standard Banner Ads - 0.8% CTR, 2.1% conversion rate
   - Text-only Ads - 1.2% CTR, 1.7% conversion rate

Would you like me to create a visualization comparing these assets or provide recommendations for improving the underperforming assets?`;
  }
  
  // CTR trends
  else if (normalizedUserMessage.includes('ctr') || normalizedUserMessage.includes('click-through') || normalizedUserMessage.includes('click through')) {
    return `Here's my analysis of CTR trends across campaigns from Nov 25 to Dec 1, 2024:

1. **Campaign "Product Awareness" showed the most improvement**:
   - Starting CTR: 2.1%
   - Ending CTR: 3.4%
   - Overall improvement: +61.9%
   - Key factors: New creative assets, improved targeting parameters

2. **Overall CTR Trends**:
   - Average CTR across all campaigns: 2.8% (industry benchmark: 2.4%)
   - Best day: Wednesday, Nov 27 (3.6% average CTR)
   - Best time: 6-9 PM (3.8% average CTR)
   - Best device: Mobile (3.2% vs 2.1% on desktop)

3. **Campaign CTR Rankings**:
   - Product Awareness: 3.4% (↑ 61.9%)
   - Holiday Special: 3.1% (↑ 14.8%)
   - Retargeting: 2.9% (↑ 7.4%)
   - Brand Awareness: 2.2% (↓ 4.3%)

Would you like a detailed breakdown of which specific ad variations contributed most to these improvements?`;
  }
  
  // Simple yes response
  else if (normalizedUserMessage === 'yes') {
    return `Great! Here's a visualization of the top performing assets based on CTR and conversion rate:

[Chart: Asset Performance Comparison]

**Key Insights:**

1. Video content consistently outperforms other formats across all campaigns
2. Assets with clear call-to-actions saw 47% higher conversion rates
3. Product demonstration assets performed best in the "Product Awareness" campaign
4. Testimonial-based assets performed best in the "Trust Building" campaign

Would you like me to drill down into any specific asset type for more detailed metrics?`;
  }
  
  // Generate a visualization response
  else if (normalizedUserMessage.includes('visualization') || normalizedUserMessage.includes('chart') || normalizedUserMessage.includes('graph')) {
    return `I've created a visualization based on your campaign data:

[Chart: Campaign Performance Metrics Nov 25 - Dec 1]

This chart shows the relative performance of each campaign across four key metrics:
- CTR (Click-Through Rate)
- Conversion Rate
- ROI (Return on Investment)
- CPA (Cost Per Acquisition)

As you can see, "Holiday Special" leads in ROI, while "Product Awareness" shows the highest improvement in CTR.

Would you like me to create a different type of visualization or focus on specific metrics?`;
  }
  
  // Default response for any other query
  else {
    return `Based on the campaign data from Nov 25 to Dec 1, 2024, I can provide insights on:

1. Overall campaign performance and week-over-week changes
2. Top performing assets and recommendations for optimization
3. Budget allocation suggestions for maximum ROI
4. CTR trends and factors influencing performance

What specific aspect would you like me to analyze in more detail?`;
  }
};

// Chat API endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, system, tools } = req.body;
    const userMessage = messages[messages.length - 1]?.content || '';
    
    // Use mock responses for testing or when API key is not available
    if (!DEEPSEEK_API_KEY || process.env.USE_MOCK === 'true') {
      // Simulate API latency
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockResponse = getMockResponse(userMessage);
      
      // Return the mock response
      return res.json({
        choices: [
          {
            message: {
              role: 'assistant',
              content: mockResponse
            }
          }
        ]
      });
    }
    
    // If API key is available, make actual request to DeepSeek
    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: messages,
        system: system || '',
        stream: false // Set to true for streaming responses
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('DeepSeek API error:', errorData);
      return res.status(response.status).json({
        error: `DeepSeek API error: ${errorData.error?.message || 'Unknown error'}`
      });
    }
    
    const data = await response.json();
    return res.json(data);
    
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});