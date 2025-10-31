# MILS Lubricants Website 

**Mining Industrial Lubricant Suppliers (MILS)** - Official website for TotalEnergies Authorized Distributor in Zimbabwe.

![MILS Website](https://img.shields.io/badge/Status-Active-success)
![TotalEnergies](https://img.shields.io/badge/Partner-TotalEnergies-red)
![License](https://img.shields.io/badge/License-Proprietary-blue)

## Overview

MILS is a registered lubricant and oil company headquartered in Bulawayo, Zimbabwe, specializing in the supply of petroleum-based lubricants and grease products. As a proud TotalEnergies Authorized Distributor, we provide world-class lubricant solutions for mining, industrial, agricultural, and automotive sectors throughout the SADC region.

## Features

### Modern Design
- **Responsive Layout** - Optimized for desktop, tablet, and mobile
- **GSAP Animations** - Smooth scroll animations and transitions
- **TotalEnergies Branding** - Official brand colors and styling
- **Video Hero Section** - Engaging background video

### Product Showcase
- **Interactive Carousel** - 5 product categories with images and descriptions
- **77+ Products** - Complete catalog with specifications
- **Advanced Search** - Filter by category, viscosity, specifications
- **Product Details** - Datasheets, pack sizes, applications

### Live Data
- **Oil Price Ticker** - Real-time WTI, Brent, and Natural Gas prices
- **Price Change Tracking** - Percentage changes calculated from previous fetch
- **Auto-refresh** - Updates every hour
- **Optimized API Calls** - Only 3 calls per hour (88% reduction)

### Industry Solutions
- Mining & Heavy Industry
- Agriculture & Farming
- Transportation (Road, Rail, Air)
- Marine & Shipping
- Manufacturing
- Construction

## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- Python (for local server)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/YOUR_USERNAME/mils-lubricants-website.git
cd mils-lubricants-website
```

2. **Install dependencies**
```bash
npm install
```

3. **Start the development server**
```bash
# Option 1: Using Python
python -m http.server 8000

# Option 2: Using the batch file
start-server.bat

# Option 3: Using npm (Astro)
npm run dev
```

4. **Open in browser**
```
http://localhost:8000
```

## Project Structure

```
lubricants-website/
├── index.html              # Main homepage
├── products.html           # Product catalog page
├── blog.html              # Blog/news page
├── news.html              # News page
├── styles.css             # Main stylesheet
├── script.js              # Main JavaScript
├── gsap-animations.js     # GSAP scroll animations
├── products/
│   └── database/
│       └── products.json  # 77 products database
├── assets/
│   ├── images/           # Logos, backgrounds, client logos
│   ├── videos/           # Hero video
│   └── fonts/            # TotalEnergies fonts
└── images/
    └── about-bg.png      # About section background
```

## Technologies

- **HTML5** - Semantic markup
- **CSS3** - Modern styling with animations
- **JavaScript (ES6+)** - Interactive features
- **GSAP** - Scroll animations
- **Oil Price API** - Real-time commodity prices
- **Astro** - Static site generation (optional)

## Product Categories

1. **Engine Oils** - Passenger vehicles, heavy-duty diesel
2. **Industrial Lubricants** - Hydraulic, gear, compressor oils
3. **Greases** - Multi-purpose, high-temperature
4. **Agricultural Solutions** - Tractor oils, farm equipment
5. **Specialty Products** - Brake fluids, coolants, waxes

## Configuration

### Oil Price API
The website uses the Oil Price API for real-time commodity prices. See `OIL_PRICE_API_SETUP.md` for configuration details.

### Products Database
Products are stored in `products/database/products.json`. See `products/README.md` for management instructions.

## Responsive Breakpoints

- **Desktop**: 1200px+
- **Tablet**: 768px - 1199px
- **Mobile**: < 768px

## Key Features

### Products Carousel
- 5 slides with product categories
- Auto-advance every 5 seconds
- Keyboard navigation (arrow keys)
- Touch/swipe support for mobile
- Smooth transitions

### Oil Price Ticker
- Real-time prices for WTI, Brent, Natural Gas
- Percentage change tracking
- Auto-refresh every hour
- Cached data for offline viewing

### Search & Filter
- Real-time search as you type
- Filter by category, viscosity, specifications
- Pagination (12/24/36 products per page)
- Responsive grid layout

## Documentation

- [How to Run](HOW-TO-RUN.md)
- [GSAP Features](GSAP-FEATURES.md)
- [Oil Price API Setup](OIL_PRICE_API_SETUP.md)
- [Products Management](products/README.md)

## Deployment

The website is static and can be deployed to:
- GitHub Pages
- Netlify
- Vercel
- AWS S3
- Any static hosting service

## Contact

**Mining Industrial Lubricant Suppliers (MILS)**
- **Location**: Bulawayo, Zimbabwe
- **Region**: SADC
- **Partner**: TotalEnergies Authorized Distributor

## License

Proprietary - 2025 Mining Industrial Lubricant Suppliers (MILS)

## Acknowledgments

- **TotalEnergies** - Official partner and product supplier
- **GSAP** - Animation library
- **Oil Price API** - Real-time commodity data
- **Unsplash** - Stock images

---

**Built with for MILS - Your Trusted TotalEnergies Partner in Zimbabwe**
