// Store previous prices for percentage calculation
let previousPrices = {};

// Oil Price API Integration
async function fetchOilPrices() {
    const tickerPrices = document.getElementById('tickerPrices');
    console.log('fetchOilPrices called, tickerPrices element:', tickerPrices);
    
    try {
        const apiKey = '0f2b4c594c76531a3dfce1bbbce7a5bcb80646cc80ec3a668f475d9eebc39a23';
        
        console.log('Fetching from API...');
        
        // Fetch multiple commodities - latest prices only
        const commodities = ['WTI_USD', 'BRENT_CRUDE_USD', 'NATURAL_GAS_USD'];
        
        // Fetch latest prices for each commodity
        const pricePromises = commodities.map(async (code) => {
            try {
                // Fetch latest price only (no historical data needed)
                const latestResponse = await fetch(`https://api.oilpriceapi.com/v1/prices/latest?by_code=${code}`, {
                    headers: {
                        'Authorization': `Token ${apiKey}`,
                        'Content-Type': 'application/json'
                    }
                });
                
                if (!latestResponse.ok) {
                    console.error(`${code} - API response not OK:`, latestResponse.status);
                    return null;
                }
                
                const latestData = await latestResponse.json();
                console.log(`${code} - Fetched current price: $${latestData.data.price}`);
                
                // Return data (percentage will be calculated from stored previous prices)
                return {
                    ...latestData.data,
                    change_percentage: null // Will be calculated in displayOilPrices
                };
            } catch (error) {
                console.error(`Error fetching ${code}:`, error);
                return null;
            }
        });
        
        const results = await Promise.all(pricePromises);
        console.log('All API responses with changes:', results);
        
        // Combine all valid results
        const allPrices = results.filter(r => r !== null);
        
        if (allPrices.length === 0) {
            throw new Error('No price data received');
        }
        
        // Display prices
        displayOilPrices({ data: allPrices });
        
        // Store in localStorage with timestamp and previous prices
        localStorage.setItem('oilPrices', JSON.stringify({
            data: { data: allPrices },
            timestamp: Date.now()
        }));
        
        // Store previous prices separately for next comparison
        localStorage.setItem('previousOilPrices', JSON.stringify(previousPrices));
        
    } catch (error) {
        console.error('Error fetching oil prices:', error);
        console.error('Error details:', error.message);
        
        // Try to load cached data
        const cached = localStorage.getItem('oilPrices');
        if (cached) {
            console.log('Attempting to use cached data as fallback');
            try {
                const { data, timestamp } = JSON.parse(cached);
                const hoursSinceCache = (Date.now() - timestamp) / (1000 * 60 * 60);
                
                // Use cached data if less than 24 hours old
                if (hoursSinceCache < 24) {
                    console.log('Using cached data (less than 24 hours old)');
                    displayOilPrices(data);
                    return;
                }
            } catch (e) {
                console.error('Error parsing cached data:', e);
            }
        }
        
        // Show error message
        console.log('Showing error message');
        if (tickerPrices) {
            tickerPrices.innerHTML = `
                <div class="price-error">
                    Unable to load live prices. Please check back later.
                    <br><small>Error: ${error.message}</small>
                </div>
            `;
        }
    }
}

function displayOilPrices(data) {
    console.log('displayOilPrices called with data:', data);
    
    const tickerPrices = document.getElementById('tickerPrices');
    console.log('tickerPrices element:', tickerPrices);
    
    if (!tickerPrices) {
        console.error('tickerPrices element not found!');
        return;
    }
    
    // Handle different possible API response structures
    const priceData = data.data || data;
    console.log('Extracted priceData:', priceData);
    console.log('Full priceData structure:', JSON.stringify(priceData, null, 2));
    
    // Extract key prices with flexible property access
    const prices = [];
    
    console.log('Available properties:', Object.keys(priceData));
    console.log('Is array?', Array.isArray(priceData));
    
    // If priceData is an array, process each item
    if (Array.isArray(priceData)) {
        console.log('Processing array of prices...');
        priceData.forEach(item => {
            console.log('Price item:', item);
            if (item.code && item.price !== undefined) {
                // Format label nicely
                let label = item.code
                    .replace(/_USD$/, '')
                    .replace(/_/g, ' ')
                    .replace(/BRENT CRUDE/, 'Brent')
                    .replace(/WTI/, 'WTI')
                    .replace(/NATURAL GAS/, 'Nat Gas');
                
                // Calculate percentage change from previous price
                let calculatedChange = item.change_percentage || item.diff_percentage;
                
                if (calculatedChange === null || calculatedChange === undefined) {
                    // Check if we have a previous price stored
                    const previousPrice = previousPrices[item.code];
                    
                    if (previousPrice && previousPrice !== item.price) {
                        // Calculate real percentage change: ((current - previous) / previous) * 100
                        const priceDiff = item.price - previousPrice;
                        calculatedChange = (priceDiff / previousPrice) * 100;
                        console.log(`${item.code}: Previous $${previousPrice} → Current $${item.price}`);
                        console.log(`  Difference: $${priceDiff.toFixed(4)}, Change: ${calculatedChange.toFixed(4)}% (displayed as ${calculatedChange.toFixed(2)}%)`);
                    } else {
                        // No previous price yet, default to 0
                        calculatedChange = 0;
                        console.log(`${item.code}: First fetch, no previous price to compare`);
                    }
                }
                
                // Store current price for next comparison
                previousPrices[item.code] = item.price;
                
                prices.push({
                    label: label,
                    value: item.price,
                    change: calculatedChange,
                    currency: item.currency || 'USD'
                });
            }
        });
        
        console.log('Extracted prices from array:', prices);
        
        if (prices.length > 0) {
            // Build and display HTML
            const pricesHTML = prices.map(price => {
                console.log('Processing price:', price.label, 'Change:', price.change);
                
                // Always show change percentage
                const change = price.change !== null && price.change !== undefined ? price.change : 0;
                const changeClass = change >= 0 ? 'positive' : 'negative';
                const changeSymbol = change >= 0 ? '▲' : '▼';
                const changeValue = Math.abs(change).toFixed(2);
                const changeHTML = `<span class="price-change ${changeClass}">${changeSymbol} ${changeValue}%</span>`;
                
                return `
                    <div class="price-item">
                        <span class="price-label">${price.label}</span>
                        <span class="price-value">$${typeof price.value === 'number' ? price.value.toFixed(2) : price.value}</span>
                        ${changeHTML}
                    </div>
                `;
            }).join('');
            
            console.log('Generated HTML:', pricesHTML);
            tickerPrices.innerHTML = pricesHTML;
            console.log('Prices displayed successfully!');
            return;
        }
    }
    
    // WTI Crude Oil - try multiple property names
    if (priceData.price !== undefined || priceData.wti_price !== undefined || priceData.wti !== undefined) {
        const wtiPrice = priceData.price || priceData.wti_price || priceData.wti?.price || priceData.wti;
        const wtiChange = priceData.change_percentage || priceData.wti_change_percentage || priceData.wti?.change_percentage || 0;
        
        if (wtiPrice !== undefined) {
            prices.push({
                label: 'WTI Crude',
                value: wtiPrice,
                change: wtiChange,
                currency: 'USD'
            });
        }
    }
    
    // Brent Crude Oil
    if (priceData.brent_price !== undefined || priceData.brent !== undefined) {
        const brentPrice = priceData.brent_price || priceData.brent?.price || priceData.brent;
        const brentChange = priceData.brent_change_percentage || priceData.brent?.change_percentage || 0;
        
        if (brentPrice !== undefined) {
            prices.push({
                label: 'Brent Crude',
                value: brentPrice,
                change: brentChange,
                currency: 'USD'
            });
        }
    }
    
    // Natural Gas
    if (priceData.natural_gas_price !== undefined || priceData.natural_gas !== undefined || priceData.naturalGas !== undefined) {
        const gasPrice = priceData.natural_gas_price || priceData.natural_gas?.price || priceData.naturalGas?.price || priceData.natural_gas || priceData.naturalGas;
        const gasChange = priceData.natural_gas_change_percentage || priceData.natural_gas?.change_percentage || priceData.naturalGas?.change_percentage || 0;
        
        if (gasPrice !== undefined) {
            prices.push({
                label: 'Natural Gas',
                value: gasPrice,
                change: gasChange,
                currency: 'USD'
            });
        }
    }
    
    // If we only have one price, try to find more in the data structure
    if (prices.length === 1) {
        console.log('Only found one price, searching for more...');
        
        // Look for nested objects that might contain prices
        Object.keys(priceData).forEach(key => {
            if (typeof priceData[key] === 'object' && priceData[key] !== null) {
                const nestedData = priceData[key];
                if (nestedData.price !== undefined) {
                    const label = key.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1').trim();
                    prices.push({
                        label: label.charAt(0).toUpperCase() + label.slice(1),
                        value: nestedData.price,
                        change: nestedData.change_percentage || 0,
                        currency: 'USD'
                    });
                }
            }
        });
    }
    
    // If still no additional prices, look for any price-like properties
    if (prices.length === 1) {
        Object.keys(priceData).forEach(key => {
            if (key.includes('price') && typeof priceData[key] === 'number' && !prices.some(p => p.value === priceData[key])) {
                const label = key.replace(/_/g, ' ').replace(/price/i, '').trim();
                prices.push({
                    label: label.charAt(0).toUpperCase() + label.slice(1) || 'Oil',
                    value: priceData[key],
                    change: priceData[key.replace('price', 'change_percentage')] || 0,
                    currency: 'USD'
                });
            }
        });
    }
    
    // If still no prices, show the raw data structure
    if (prices.length === 0) {
        console.warn('Could not parse price data:', priceData);
        tickerPrices.innerHTML = `
            <div class="price-error">
                Price data format not recognized. Check console for details.
            </div>
        `;
        return;
    }
    
    // Build HTML
    console.log('Building HTML for prices:', prices);
    
    const pricesHTML = prices.map(price => {
        const changeClass = price.change >= 0 ? 'positive' : 'negative';
        const changeSymbol = price.change >= 0 ? '▲' : '▼';
        const changeValue = typeof price.change === 'number' ? Math.abs(price.change).toFixed(2) : '0.00';
        
        return `
            <div class="price-item">
                <span class="price-label">${price.label}</span>
                <span class="price-value">$${typeof price.value === 'number' ? price.value.toFixed(2) : price.value}</span>
                <span class="price-change ${changeClass}">
                    ${changeSymbol} ${changeValue}%
                </span>
            </div>
        `;
    }).join('');
    
    console.log('Generated HTML:', pricesHTML);
    console.log('Setting innerHTML...');
    tickerPrices.innerHTML = pricesHTML;
    console.log('Prices displayed successfully!');
}

// Search Functionality
const searchData = [
    { title: 'Engine Oil', description: 'High-performance engine oils for all vehicle types', category: 'Products', url: 'products.html#engine-oil' },
    { title: 'Hydraulic Fluid', description: 'Premium hydraulic fluids for industrial applications', category: 'Products', url: 'products.html#hydraulic' },
    { title: 'Marine Lubricants', description: 'Specialized lubrication solutions for marine vessels', category: 'Industries', url: 'index.html#industries' },
    { title: 'Mining Solutions', description: 'Heavy-duty lubricants for mining equipment', category: 'Industries', url: 'index.html#industries' },
    { title: 'Industrial Grease', description: 'High-quality greases for industrial machinery', category: 'Products', url: 'products.html#grease' },
    { title: 'Transmission Oil', description: 'Smooth transmission performance oils', category: 'Products', url: 'products.html#transmission' },
    { title: 'Gear Oil', description: 'Advanced gear protection lubricants', category: 'Products', url: 'products.html#gear' },
    { title: 'Agriculture', description: 'Lubricant solutions for agricultural equipment', category: 'Industries', url: 'index.html#industries' },
    { title: 'Construction', description: 'Heavy-duty lubricants for construction machinery', category: 'Industries', url: 'index.html#industries' },
    { title: 'About Us', description: 'Learn more about MILS and our mission', category: 'Company', url: 'index.html#about' },
    { title: 'Contact', description: 'Get in touch with our team', category: 'Company', url: 'index.html#contact' },
    { title: 'News', description: 'Latest industry news and updates', category: 'Content', url: 'news.html' },
    { title: 'Blog', description: 'Expert insights and technical guides', category: 'Content', url: 'blog.html' }
];

function initializeSearch() {
    const searchModal = document.getElementById('searchModal');
    const searchTrigger = document.querySelector('[data-js="search-trigger"]');
    const searchClose = document.getElementById('searchClose');
    const searchOverlay = document.getElementById('searchOverlay');
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    
    if (!searchModal || !searchTrigger) return;
    
    // Open search modal
    searchTrigger.addEventListener('click', () => {
        searchModal.classList.add('active');
        setTimeout(() => searchInput.focus(), 100);
    });
    
    // Close search modal
    const closeSearch = () => {
        searchModal.classList.remove('active');
        searchInput.value = '';
        showSuggestions();
    };
    
    searchClose.addEventListener('click', closeSearch);
    searchOverlay.addEventListener('click', closeSearch);
    
    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && searchModal.classList.contains('active')) {
            closeSearch();
        }
    });
    
    // Search functionality
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.trim().toLowerCase();
        
        if (query.length === 0) {
            showSuggestions();
            return;
        }
        
        const results = searchData.filter(item => 
            item.title.toLowerCase().includes(query) ||
            item.description.toLowerCase().includes(query) ||
            item.category.toLowerCase().includes(query)
        );
        
        displaySearchResults(results, query);
    });
    
    // Suggestion tag clicks
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('suggestion-tag')) {
            searchInput.value = e.target.textContent;
            searchInput.dispatchEvent(new Event('input'));
        }
    });
    
    function showSuggestions() {
        searchResults.innerHTML = `
            <div class="search-suggestions">
                <h3>Popular Searches</h3>
                <div class="suggestion-tags">
                    <span class="suggestion-tag">Engine Oil</span>
                    <span class="suggestion-tag">Hydraulic Fluid</span>
                    <span class="suggestion-tag">Marine Lubricants</span>
                    <span class="suggestion-tag">Mining Solutions</span>
                    <span class="suggestion-tag">Industrial Grease</span>
                </div>
            </div>
        `;
    }
    
    function displaySearchResults(results, query) {
        if (results.length === 0) {
            searchResults.innerHTML = `
                <div class="no-results">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="M21 21l-4.35-4.35"></path>
                    </svg>
                    <h3>No results found for "${query}"</h3>
                    <p>Try searching for something else</p>
                </div>
            `;
            return;
        }
        
        const resultsHTML = results.map(item => `
            <div class="search-result-item" onclick="window.location.href='${item.url}'">
                <div class="search-result-title">${highlightText(item.title, query)}</div>
                <div class="search-result-description">${highlightText(item.description, query)}</div>
                <span class="search-result-category">${item.category}</span>
            </div>
        `).join('');
        
        searchResults.innerHTML = resultsHTML;
    }
    
    function highlightText(text, query) {
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<strong>$1</strong>');
    }
}

// Initialize oil prices on page load
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing oil prices...');
    
    // Load previous prices from localStorage
    const storedPreviousPrices = localStorage.getItem('previousOilPrices');
    if (storedPreviousPrices) {
        try {
            previousPrices = JSON.parse(storedPreviousPrices);
            console.log('Loaded previous prices:', previousPrices);
        } catch (e) {
            console.error('Error loading previous prices:', e);
            previousPrices = {};
        }
    }
    
    // Initialize search
    initializeSearch();
    
    const oilPricesTicker = document.getElementById('oilPricesTicker');
    console.log('Oil prices ticker element:', oilPricesTicker);

    if (oilPricesTicker) {
        console.log('Ticker found, fetching prices...');

        // Check if we have recent cached data
        const cached = localStorage.getItem('oilPrices');

        if (cached) {
            console.log('Found cached data');
            try {
                const { data, timestamp } = JSON.parse(cached);
                const hoursSinceCache = (Date.now() - timestamp) / (1000 * 60 * 60);

                // If cache is less than 1 hour old, use it immediately
                if (hoursSinceCache < 1) {
                    console.log('Using cached data (less than 1 hour old)');
                    displayOilPrices(data);
                    // Still fetch fresh data in background to update percentages
                    fetchOilPrices();
                } else {
                    console.log('Cache expired, fetching fresh data');
                    fetchOilPrices();
                }
            } catch (e) {
                console.error('Error parsing cached data:', e);
                fetchOilPrices();
            }
        } else {
            console.log('No cache found, fetching fresh data');
            fetchOilPrices();
        }

        // Refresh prices every hour
        setInterval(fetchOilPrices, 60 * 60 * 1000);
    } else {
        console.error('Oil prices ticker element not found!');
    }
});

// Navbar and Oil Prices Ticker scroll effect (fallback if GSAP not loaded)
const siteHeader = document.getElementById('navbar');
const oilPricesTicker = document.getElementById('oilPricesTicker');
let lastScroll = 0;

if (siteHeader && typeof gsap === 'undefined') {
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            siteHeader.classList.add('scrolled');
            if (oilPricesTicker) {
                oilPricesTicker.classList.add('scrolled');
            }
        } else {
            siteHeader.classList.remove('scrolled');
            if (oilPricesTicker) {
                oilPricesTicker.classList.remove('scrolled');
            }
        }
        
        lastScroll = currentScroll;
    });
}

// Mobile menu toggle (fallback if GSAP not loaded)
if (typeof gsap === 'undefined') {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-primary__links');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        document.querySelectorAll('.nav-primary__links a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
}

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            
            // Add staggered animation for process cards
            if (entry.target.classList.contains('process-card')) {
                const cards = document.querySelectorAll('.process-card');
                cards.forEach((card, index) => {
                    setTimeout(() => {
                        card.classList.add('visible');
                    }, index * 100);
                });
            }
            
            // Add staggered animation for industry cards
            if (entry.target.classList.contains('industry-card')) {
                const cards = document.querySelectorAll('.industry-card');
                cards.forEach((card, index) => {
                    setTimeout(() => {
                        card.classList.add('visible');
                    }, index * 150);
                });
            }
        }
    });
}, observerOptions);

// Observe all process cards
document.querySelectorAll('.process-card').forEach(card => {
    observer.observe(card);
});

// Observe all industry cards
document.querySelectorAll('.industry-card').forEach(card => {
    observer.observe(card);
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Parallax effect for hero video
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroVideo = document.querySelector('.hero-video');
    if (heroVideo) {
        heroVideo.style.transform = `translate(-50%, -50%) translateY(${scrolled * 0.3}px)`;
    }
});

// Process card hover effect with 3D tilt
document.querySelectorAll('.process-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
});

// Industry card hover effect
document.querySelectorAll('.industry-card').forEach(card => {
    const image = card.querySelector('.industry-image');
    
    card.addEventListener('mouseenter', () => {
        image.style.transform = 'scale(1.1)';
        image.style.transition = 'transform 0.5s ease';
    });
    
    card.addEventListener('mouseleave', () => {
        image.style.transform = 'scale(1)';
    });
});

// Form submission handler
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        
        // Show success message
        const button = contactForm.querySelector('button[type="submit"]');
        const originalText = button.textContent;
        button.textContent = 'Message Sent!';
        button.style.background = '#4caf50';
        
        // Reset form
        setTimeout(() => {
            contactForm.reset();
            button.textContent = originalText;
            button.style.background = '';
        }, 3000);
    });
}

// Add floating animation to process numbers
document.querySelectorAll('.process-number').forEach((number, index) => {
    number.style.animation = `float 3s ease-in-out ${index * 0.2}s infinite`;
});

// Create floating animation keyframes dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes float {
        0%, 100% {
            transform: translateY(0px);
        }
        50% {
            transform: translateY(-10px);
        }
    }
`;
document.head.appendChild(style);

// Add ripple effect to buttons
document.querySelectorAll('button, .cta-button').forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Add ripple styles
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    button, .cta-button {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

// Counter animation for process numbers
const animateCounter = (element, target, duration) => {
    let start = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start);
        }
    }, 16);
};

// Trigger counter animation when process cards are visible
const processObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const number = entry.target.querySelector('.process-number');
            const targetNumber = parseInt(number.textContent);
            number.textContent = '0';
            animateCounter(number, targetNumber, 1000);
            processObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.process-card').forEach(card => {
    processObserver.observe(card);
});

// Add cursor trail effect
let cursorTrail = [];
const trailLength = 10;

document.addEventListener('mousemove', (e) => {
    cursorTrail.push({ x: e.clientX, y: e.clientY });
    
    if (cursorTrail.length > trailLength) {
        cursorTrail.shift();
    }
});

// Animate cursor trail (optional - can be enabled/disabled)
function drawCursorTrail() {
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '9999';
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Uncomment to enable cursor trail
    // document.body.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        cursorTrail.forEach((point, index) => {
            const opacity = index / trailLength;
            const size = (index / trailLength) * 5;
            
            ctx.beginPath();
            ctx.arc(point.x, point.y, size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(233, 69, 96, ${opacity * 0.5})`;
            ctx.fill();
        });
        
        requestAnimationFrame(animate);
    }
    
    // Uncomment to enable cursor trail animation
    // animate();
}

drawCursorTrail();

// Add loading animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// Add scroll progress indicator
const scrollProgress = document.createElement('div');
scrollProgress.style.position = 'fixed';
scrollProgress.style.top = '0';
scrollProgress.style.left = '0';
scrollProgress.style.height = '3px';
scrollProgress.style.background = 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)';
scrollProgress.style.zIndex = '10000';
scrollProgress.style.transition = 'width 0.1s ease';
document.body.appendChild(scrollProgress);

window.addEventListener('scroll', () => {
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (window.pageYOffset / windowHeight) * 100;
    scrollProgress.style.width = scrolled + '%';
});

// Add typing effect to hero title
const heroTitle = document.querySelector('.hero-title');
if (heroTitle) {
    const text = heroTitle.textContent;
    heroTitle.textContent = '';
    let index = 0;
    
    function typeWriter() {
        if (index < text.length) {
            heroTitle.textContent += text.charAt(index);
            index++;
            setTimeout(typeWriter, 50);
        }
    }
    
    // Start typing after page load
    setTimeout(typeWriter, 500);
}

// Add particle effect to hero section (lightweight version)
function createParticles() {
    const hero = document.querySelector('.hero');
    const particlesContainer = document.createElement('div');
    particlesContainer.style.position = 'absolute';
    particlesContainer.style.top = '0';
    particlesContainer.style.left = '0';
    particlesContainer.style.width = '100%';
    particlesContainer.style.height = '100%';
    particlesContainer.style.overflow = 'hidden';
    particlesContainer.style.pointerEvents = 'none';
    
    hero.appendChild(particlesContainer);
    
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = Math.random() * 3 + 1 + 'px';
        particle.style.height = particle.style.width;
        particle.style.background = 'rgba(255, 255, 255, 0.5)';
        particle.style.borderRadius = '50%';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animation = `float-particle ${Math.random() * 10 + 5}s ease-in-out infinite`;
        particle.style.animationDelay = Math.random() * 5 + 's';
        
        particlesContainer.appendChild(particle);
    }
}

// Add particle animation keyframes
const particleStyle = document.createElement('style');
particleStyle.textContent = `
    @keyframes float-particle {
        0%, 100% {
            transform: translate(0, 0);
            opacity: 0;
        }
        10% {
            opacity: 1;
        }
        90% {
            opacity: 1;
        }
        50% {
            transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px);
        }
    }
`;
document.head.appendChild(particleStyle);

createParticles();

// ========================================
// Products Carousel - Infinite & Beautiful
// ========================================
class InfiniteCarousel {
    constructor() {
        this.currentSlide = 0;
        this.totalSlides = 5;
        this.isTransitioning = false;
        this.autoPlayInterval = null;
        this.track = document.querySelector('.carousel-track');
        this.dots = document.querySelectorAll('.dot');
        this.slides = document.querySelectorAll('.carousel-slide');
        
        if (!this.track || !this.dots.length) return;
        
        this.init();
    }
    
    init() {
        // Clone first and last slides for infinite effect
        this.cloneSlides();
        
        // Set initial position
        this.updatePosition(false);
        
        // Start autoplay
        this.startAutoPlay();
        
        // Add event listeners
        this.addEventListeners();
        
        // Add entrance animation
        this.animateSlideIn();
    }
    
    cloneSlides() {
        const firstSlide = this.slides[0].cloneNode(true);
        const lastSlide = this.slides[this.slides.length - 1].cloneNode(true);
        
        this.track.appendChild(firstSlide);
        this.track.insertBefore(lastSlide, this.slides[0]);
        
        // Update slides reference
        this.slides = document.querySelectorAll('.carousel-slide');
        this.currentSlide = 1; // Start at first real slide
    }
    
    updatePosition(animate = true) {
        if (animate) {
            this.track.style.transition = 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        } else {
            this.track.style.transition = 'none';
        }
        
        const offset = -this.currentSlide * 100;
        this.track.style.transform = `translateX(${offset}%)`;
        
        // Update dots (accounting for cloned slides)
        const realIndex = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
        this.dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === realIndex);
        });
    }
    
    moveCarousel(direction) {
        if (this.isTransitioning) return;
        
        this.isTransitioning = true;
        this.currentSlide += direction;
        
        this.updatePosition(true);
        
        // Handle infinite loop
        setTimeout(() => {
            if (this.currentSlide === 0) {
                this.currentSlide = this.totalSlides;
                this.updatePosition(false);
            } else if (this.currentSlide === this.totalSlides + 1) {
                this.currentSlide = 1;
                this.updatePosition(false);
            }
            this.isTransitioning = false;
        }, 800);
        
        // Reset autoplay
        this.resetAutoPlay();
    }
    
    goToSlide(slideIndex) {
        if (this.isTransitioning) return;
        
        this.isTransitioning = true;
        this.currentSlide = slideIndex + 1; // +1 for cloned slide
        
        this.updatePosition(true);
        
        setTimeout(() => {
            this.isTransitioning = false;
        }, 800);
        
        this.resetAutoPlay();
    }
    
    startAutoPlay() {
        this.autoPlayInterval = setInterval(() => {
            this.moveCarousel(1);
        }, 6000);
    }
    
    resetAutoPlay() {
        clearInterval(this.autoPlayInterval);
        this.startAutoPlay();
    }
    
    addEventListeners() {
        // Navigation buttons
        const prevBtn = document.querySelector('.prev-btn');
        const nextBtn = document.querySelector('.next-btn');
        
        if (prevBtn) prevBtn.addEventListener('click', () => this.moveCarousel(-1));
        if (nextBtn) nextBtn.addEventListener('click', () => this.moveCarousel(1));
        
        // Dots
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.goToSlide(index));
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.moveCarousel(-1);
            if (e.key === 'ArrowRight') this.moveCarousel(1);
        });
        
        // Touch/swipe support
        let touchStartX = 0;
        let touchEndX = 0;
        
        const carousel = document.querySelector('.products-carousel');
        if (carousel) {
            carousel.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
            });
            
            carousel.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                const diff = touchStartX - touchEndX;
                
                if (Math.abs(diff) > 50) {
                    this.moveCarousel(diff > 0 ? 1 : -1);
                }
            });
        }
        
        // Pause on hover
        if (carousel) {
            carousel.addEventListener('mouseenter', () => {
                clearInterval(this.autoPlayInterval);
            });
            
            carousel.addEventListener('mouseleave', () => {
                this.startAutoPlay();
            });
        }
    }
    
    animateSlideIn() {
        // Animate current slide content
        const currentSlideEl = this.slides[this.currentSlide];
        const content = currentSlideEl.querySelector('.slide-content');
        const image = currentSlideEl.querySelector('.slide-image img');
        
        if (content) {
            content.style.opacity = '0';
            content.style.transform = 'translateX(50px)';
            
            setTimeout(() => {
                content.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
                content.style.opacity = '1';
                content.style.transform = 'translateX(0)';
            }, 100);
        }
        
        if (image) {
            image.style.transform = 'scale(1.1)';
            setTimeout(() => {
                image.style.transition = 'transform 0.8s ease';
                image.style.transform = 'scale(1)';
            }, 100);
        }
    }
}

// Initialize carousel when DOM is ready
if (document.querySelector('.products-carousel')) {
    new InfiniteCarousel();
}

console.log('Industrial Lubricants Website - Loaded Successfully! 🚀');
