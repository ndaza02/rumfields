# Oil Price API Setup Guide

## Overview
The website now displays live oil prices on the hero section using the OilPriceAPI service.

## Features
- ✅ Real-time WTI Crude, Brent Crude, and Natural Gas prices
- ✅ Price change indicators (up/down arrows with percentages)
- ✅ Beautiful glassmorphism design with live indicator
- ✅ Smart caching system (reduces API calls)
- ✅ Automatic refresh every hour
- ✅ Fallback to cached data if API fails

## API Setup Instructions

### Step 1: Get Your Free API Key

1. Visit [OilPriceAPI.com](https://www.oilpriceapi.com/)
2. Click "Get Started" or "Sign Up"
3. Create a free account
4. Navigate to your dashboard
5. Copy your API key

### Step 2: Add API Key to Your Website

Open `script.js` and replace `YOUR_API_KEY_HERE` with your actual API key:

```javascript
const response = await fetch('https://api.oilpriceapi.com/v1/prices/latest', {
    headers: {
        'Authorization': 'Bearer YOUR_ACTUAL_API_KEY_HERE',
        'Content-Type': 'application/json'
    }
});
```

### Step 3: Test the Integration

1. Open `index.html` in your browser
2. The oil prices ticker should appear in the hero section
3. Check the browser console for any errors
4. Verify prices are displaying correctly

## Free Tier Limits

- **24 requests per day** (~720 requests/month)
- **Automatic caching** reduces API calls:
  - Prices cached for 1 hour
  - Cached data used for up to 24 hours if API fails
  - Only 1 request per hour during active browsing

## API Response Structure

The API returns data in this format:

```json
{
  "status": "success",
  "data": {
    "price": 75.23,
    "change_percentage": 1.5,
    "brent_price": 78.45,
    "brent_change_percentage": 1.2,
    "natural_gas_price": 2.85,
    "natural_gas_change_percentage": -0.5
  }
}
```

## Customization

### Change Displayed Commodities

Edit the `prices` array in `displayOilPrices()` function:

```javascript
const prices = [
    {
        label: 'WTI Crude',
        value: data.data?.price || 'N/A',
        change: data.data?.change_percentage || 0,
        currency: 'USD'
    },
    // Add more commodities here
];
```

### Adjust Refresh Interval

Change the interval in `script.js` (default: 1 hour):

```javascript
// Refresh every 2 hours instead
setInterval(fetchOilPrices, 2 * 60 * 60 * 1000);
```

### Modify Cache Duration

Adjust cache validity in the code:

```javascript
// Use cache if less than 2 hours old
if (hoursSinceCache < 2) {
    displayOilPrices(data);
}
```

## Styling

The ticker uses these CSS classes:
- `.oil-prices-ticker` - Main container
- `.ticker-header` - Header with icon and title
- `.ticker-prices` - Prices container
- `.price-item` - Individual price card
- `.price-value` - Price number
- `.price-change` - Change indicator

Customize in `styles.css` to match your brand.

## Troubleshooting

### Prices Not Showing

1. **Check API Key**: Ensure it's correctly added to `script.js`
2. **Check Console**: Open browser DevTools (F12) and look for errors
3. **Verify API Limits**: Check if you've exceeded 24 requests/day
4. **Test API Directly**: Use Postman or curl to test the endpoint

### CORS Errors

If you see CORS errors:
1. The API should support CORS by default
2. If issues persist, consider using a backend proxy
3. Contact OilPriceAPI support for assistance

### Cached Data Issues

Clear localStorage to reset cache:

```javascript
localStorage.removeItem('oilPrices');
```

## Alternative: Mock Data for Testing

If you want to test without an API key, add this to `script.js`:

```javascript
// Mock data for testing
function displayMockPrices() {
    const mockData = {
        data: {
            price: 75.23,
            change_percentage: 1.5,
            brent_price: 78.45,
            brent_change_percentage: 1.2,
            natural_gas_price: 2.85,
            natural_gas_change_percentage: -0.5
        }
    };
    displayOilPrices(mockData);
}

// Use mock data instead of API
// displayMockPrices();
```

## Security Best Practices

⚠️ **Important**: Never commit your API key to public repositories!

### Option 1: Environment Variables (Recommended)

Create a `.env` file (add to `.gitignore`):

```
OIL_PRICE_API_KEY=your_api_key_here
```

### Option 2: Backend Proxy (Most Secure)

Create a backend endpoint that:
1. Stores the API key securely
2. Proxies requests to OilPriceAPI
3. Returns data to your frontend

Example with Node.js/Express:

```javascript
app.get('/api/oil-prices', async (req, res) => {
    const response = await fetch('https://api.oilpriceapi.com/v1/prices/latest', {
        headers: {
            'Authorization': `Bearer ${process.env.OIL_PRICE_API_KEY}`
        }
    });
    const data = await response.json();
    res.json(data);
});
```

## Support

- **OilPriceAPI Documentation**: https://www.oilpriceapi.com/docs
- **API Status**: Check their status page for outages
- **Support**: Contact support@oilpriceapi.com

## License

This integration is part of the Rumfields Enterprises website.
