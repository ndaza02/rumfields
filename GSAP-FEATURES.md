# GSAP Animation Features

## 🎬 Implemented GSAP Animations

### Hero Section
- **Staggered entrance animations** for title, subtitle, and CTA button
- **Video parallax effect** using ScrollTrigger
- **Smooth fade-in** for overlay on scroll
- **Back.out easing** for bouncy button entrance
- **Scroll indicator animation** with delay

### Navigation
- **Navbar items** animate in from top with stagger
- **Logo** slides in from left
- **Scroll-triggered class** for navbar background change
- **Mobile menu** with smooth slide-in animations

### Process Section
- **Section title** fades up on scroll
- **Process cards** stagger in from bottom with 3D rotation
- **Hover effects** with GSAP:
  - Card lifts with shadow
  - Number scales and rotates 360°
  - Icon scales and fades
- **Counter animation** for process numbers (0 to target)

### Quality Section
- **Title** scales in from center
- **Subtitle** fades up with delay
- **CTA button** bounces in with back.out easing

### Industries Section
- **Advanced stagger** for industry cards
- **3D rotation** on card entrance (rotationX)
- **Hover animations**:
  - Card elevation
  - Image zoom (scale 1.1)
  - Overlay opacity change
  - Button slides right

### Contact Section
- **Form elements** slide in from left with stagger
- **Submit button** scales in with bounce
- **Form submission** animation with color change

### Footer
- **Footer sections** fade up with stagger

### Interactive Elements
- **Magnetic buttons** - follow mouse movement
- **Smooth scroll** to sections using ScrollToPlugin
- **Scroll progress bar** at top of page
- **Page load fade-in**

## 🔧 GSAP Plugins Used

1. **GSAP Core** (v3.12.5)
2. **ScrollTrigger** - Scroll-based animations
3. **ScrollToPlugin** - Smooth scrolling to sections

## 🎯 Key Features

### Performance
- Hardware-accelerated transforms
- Optimized scroll animations with `scrub`
- Efficient event handling

### Easing Functions
- `power3.out` - Smooth deceleration
- `power4.out` - Extra smooth for hero
- `back.out(1.7)` - Bouncy effect for buttons
- `elastic.out` - Springy magnetic effect

### ScrollTrigger Options
- `toggleActions: 'play none none reverse'` - Animations reverse on scroll up
- `scrub: true` - Smooth parallax tied to scroll
- `start: 'top 80%'` - Trigger when element is 80% from top
- `once: true` - Animation plays only once

## 📝 Customization

### Adjust Animation Speed
Change `duration` values in `gsap-animations.js`:
```javascript
duration: 1.2  // Slower
duration: 0.5  // Faster
```

### Modify Stagger Timing
```javascript
stagger: {
    amount: 0.8,  // Total time for all staggers
    from: 'start' // Direction: 'start', 'end', 'center'
}
```

### Change Parallax Speed
```javascript
yPercent: 30  // Higher = more movement
```

### Disable Specific Animations
Comment out sections in `gsap-animations.js`

## 🚀 Browser Compatibility
- Chrome, Firefox, Safari, Edge (latest versions)
- Mobile browsers (iOS Safari, Chrome Mobile)
- IE11+ (with polyfills)

## 📦 File Structure
```
lubricants-website/
├── index.html           # Main HTML
├── styles.css           # Styles (minimal CSS animations)
├── gsap-animations.js   # All GSAP animations
├── script.js            # Legacy animations (kept for compatibility)
└── GSAP-FEATURES.md     # This file
```

## 💡 Tips
- GSAP handles most animations now
- CSS transitions still used for simple hover states
- ScrollTrigger markers can be enabled for debugging:
  ```javascript
  markers: true  // Add to ScrollTrigger config
  ```
