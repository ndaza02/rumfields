document.addEventListener('DOMContentLoaded', function() {
    // Register FREE GSAP plugins only
    gsap.registerPlugin(
        ScrollTrigger, 
        ScrollToPlugin,
        TextPlugin,
        MotionPathPlugin,
        Flip,
        Observer
    );
    
    // Custom Smooth Scroll (Free Alternative to ScrollSmoother)
    let scrollPos = 0;
    let targetScrollPos = 0;
    const smoothContent = document.querySelector('#smooth-content');
    
    function smoothScroll() {
        scrollPos += (targetScrollPos - scrollPos) * 0.1;
        if (smoothContent) {
            smoothContent.style.transform = `translateY(${-scrollPos}px)`;
        }
        requestAnimationFrame(smoothScroll);
    }
    
    window.addEventListener('scroll', () => {
        targetScrollPos = window.pageYOffset;
    });
    
    smoothScroll();

function initGSAPAnimations() {
    
    // ============================================
    // HERO SECTION ANIMATIONS
    // ============================================
    
    // Animate hero title with split text effect
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const ctaButton = document.querySelector('.hero-content .cta-button');
    const scrollIndicator = document.querySelector('.scroll-indicator');
    
    // Hero timeline
    const heroTL = gsap.timeline({ defaults: { ease: 'power3.out' } });
    
    heroTL
        .from(heroTitle, {
            y: 100,
            opacity: 0,
            duration: 1.2,
            ease: 'power4.out'
        })
        .from(heroSubtitle, {
            y: 50,
            opacity: 0,
            duration: 1,
        }, '-=0.6')
        .from(ctaButton, {
            scale: 0,
            opacity: 0,
            duration: 0.8,
            ease: 'back.out(1.7)',
            clearProps: 'all'
        }, '-=0.4')
        .from(scrollIndicator, {
            y: -30,
            opacity: 0,
            duration: 0.8
        }, '-=0.4');
    
    // ============================================
    // ADVANCED HERO EFFECTS (FREE PLUGINS ONLY)
    // ============================================
    
    // Custom Split Text Animation (Free Alternative)
    if (heroTitle) {
        const text = heroTitle.textContent;
        const chars = text.split('');
        heroTitle.innerHTML = chars.map(char => 
            char === ' ' ? '<span class="char">&nbsp;</span>' : `<span class="char">${char}</span>`
        ).join('');
        
        gsap.from('.hero-title .char', {
            opacity: 0,
            y: 50,
            rotateX: -90,
            stagger: 0.02,
            duration: 1,
            ease: "back.out(1.7)",
            delay: 0.5
        });
    }
    
    
    // SVG Lines Animation (Free Alternative using strokeDasharray)
    gsap.utils.toArray('.line-1, .line-2').forEach((line, i) => {
        const length = line.getTotalLength();
        line.style.strokeDasharray = length;
        line.style.strokeDashoffset = length;
        
        gsap.to(line, {
            strokeDashoffset: 0,
            duration: 3,
            ease: "power2.inOut",
            delay: 1 + (i * 0.5)
        });
    });
    
    // Hero video parallax with GSAP
    gsap.to('.hero-video', {
        yPercent: 30,
        ease: 'none',
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: true
        }
    });
    
    // Scroll Indicator Bounce Animation
    gsap.to('.scroll-indicator', {
        y: 10,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut"
    });
    
    // Mouse Wheel Animation
    gsap.to('.wheel', {
        y: 10,
        duration: 1,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut"
    });
    
    // Hero overlay fade
    gsap.to('.hero-overlay', {
        opacity: 1,
        ease: 'none',
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: true
        }
    });
    
    // ============================================
    // FLOATING PILL NAVBAR ANIMATIONS
    // ============================================
    
    const siteHeader = document.querySelector('.site-header');
    const headerRow = document.querySelector('.site-header__row');
    
    // Initial entrance animation - pill expands
    gsap.from(siteHeader, {
        scale: 0.3,
        opacity: 0,
        duration: 1.2,
        ease: 'elastic.out(1, 0.6)',
        delay: 0.2
    });
    
    // Pill expansion/contraction on scroll
    ScrollTrigger.create({
        start: 'top -80',
        end: 99999,
        onEnter: () => {
            gsap.to(siteHeader, {
                scale: 0.95,
                duration: 0.6,
                ease: 'power2.out',
                transformOrigin: 'center center'
            });
            gsap.to(headerRow, {
                padding: '0.5rem 1.2rem',
                gap: '1.5rem',
                duration: 0.6,
                ease: 'power2.out',
                force3D: true
            });
            siteHeader.classList.add('scrolled');
        },
        onLeaveBack: () => {
            gsap.to(siteHeader, {
                scale: 1,
                duration: 0.6,
                ease: 'power2.out',
                transformOrigin: 'center center'
            });
            gsap.to(headerRow, {
                padding: '0.6rem 1.5rem',
                gap: '2rem',
                duration: 0.6,
                ease: 'power2.out',
                force3D: true
            });
            siteHeader.classList.remove('scrolled');
        }
    });
    
    // Pill hover expansion
    siteHeader.addEventListener('mouseenter', () => {
        gsap.to(siteHeader, {
            scale: siteHeader.classList.contains('scrolled') ? 0.98 : 1.02,
            duration: 0.4,
            ease: 'power2.out',
            transformOrigin: 'center center'
        });
    });
    
    siteHeader.addEventListener('mouseleave', () => {
        gsap.to(siteHeader, {
            scale: siteHeader.classList.contains('scrolled') ? 0.95 : 1,
            duration: 0.4,
            ease: 'power2.out',
            transformOrigin: 'center center'
        });
    });
    
    // Animate navbar items with stagger
    gsap.from('.nav-primary__links li', {
        y: -30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.08,
        ease: 'back.out(1.5)',
        delay: 0.6,
        clearProps: 'all'
    });
    
    // Animate logo with bounce
    gsap.from('.site-header__logo', {
        scale: 0,
        opacity: 0,
        duration: 1,
        ease: 'back.out(2)',
        delay: 0.4,
        clearProps: 'all'
    });
    
    // Animate search button
    gsap.from('.site-search__toggle', {
        scale: 0,
        rotation: -180,
        opacity: 0,
        duration: 0.8,
        ease: 'back.out(2)',
        delay: 1,
        clearProps: 'all'
    });
    
    // ============================================
    // ABOUT SECTION ANIMATIONS
    // ============================================
    
    // About content animation
    gsap.from('.about-content h2', {
        scrollTrigger: {
            trigger: '.about-section',
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse'
        },
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
    });
    
    gsap.from('.about-divider', {
        scrollTrigger: {
            trigger: '.about-section',
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse'
        },
        scaleX: 0,
        transformOrigin: 'left center',
        duration: 0.8,
        ease: 'power3.out',
        delay: 0.3
    });
    
    gsap.from('.about-content p', {
        scrollTrigger: {
            trigger: '.about-section',
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse'
        },
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out',
        delay: 0.5
    });
    
    // About image animation
    gsap.from('.about-image', {
        scrollTrigger: {
            trigger: '.about-section',
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse'
        },
        x: 100,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out',
        delay: 0.2
    });

    // ============================================
    // PROCESS SECTION ANIMATIONS
    // ============================================
    
    // Section title animation
    gsap.from('.process-section .section-title', {
    y: -30,
    opacity: 0,
    duration: 0.8,
    stagger: 0.08,
    ease: 'back.out(1.5)',
    delay: 0.6,
    clearProps: 'all'
});
    
// Animate logo with bounce
gsap.from('.site-header__logo', {
    scale: 0,
    opacity: 0,
    duration: 1,
    ease: 'back.out(2)',
    delay: 0.4,
    clearProps: 'all'
});
    
// Animate search button
gsap.from('.site-search__toggle', {
    scale: 0,
    rotation: -180,
    opacity: 0,
    duration: 0.8,
    ease: 'back.out(2)',
    delay: 1,
    clearProps: 'all'
});
    
// ============================================
// ABOUT SECTION ANIMATIONS
// ============================================
    
// About content animation
gsap.from('.about-content h2', {
    scrollTrigger: {
        trigger: '.about-section',
        start: 'top 80%',
        end: 'bottom 20%',
        toggleActions: 'play none none reverse'
    },
    y: 50,
    opacity: 0,
    duration: 1,
    ease: 'power3.out'
});
    
gsap.from('.about-divider', {
    scrollTrigger: {
        trigger: '.about-section',
        start: 'top 80%',
        end: 'bottom 20%',
        toggleActions: 'play none none reverse'
    },
    scaleX: 0,
    transformOrigin: 'left center',
    duration: 0.8,
    ease: 'power3.out',
    delay: 0.3
});
    
gsap.from('.about-content p', {
    scrollTrigger: {
        trigger: '.about-section',
        start: 'top 80%',
        end: 'bottom 20%',
        toggleActions: 'play none none reverse'
    },
    y: 30,
    opacity: 0,
    duration: 0.8,
    stagger: 0.2,
    ease: 'power3.out',
    delay: 0.5
});
    
// About image animation
gsap.from('.about-image', {
    scrollTrigger: {
        trigger: '.about-section',
        start: 'top 80%',
        end: 'bottom 20%',
        toggleActions: 'play none none reverse'
    },
    x: 100,
    opacity: 0,
    duration: 1.2,
    ease: 'power3.out',
    delay: 0.2
});

// ============================================
// PROCESS SECTION ANIMATIONS
// ============================================
    
    // Section title animation
    gsap.from('.process-section .section-title', {
        scrollTrigger: {
            trigger: '.process-section',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        },
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
    });
    
    // Process cards staggered animation
    gsap.from('.process-card', {
        scrollTrigger: {
            trigger: '.process-grid',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        },
        y: 100,
        opacity: 0,
        duration: 1,
        stagger: {
            amount: 0.8,
            from: 'start'
        },
        ease: 'power3.out'
    });
    
    // Process card hover animation with GSAP
    document.querySelectorAll('.process-card').forEach(card => {
        const number = card.querySelector('.process-number');
        const icon = card.querySelector('.process-icon');
        
        card.addEventListener('mouseenter', () => {
            gsap.to(card, {
                y: -15,
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
                duration: 0.3,
                ease: 'power2.out'
            });
            
            gsap.to(number, {
                scale: 1.1,
                rotation: 360,
                duration: 0.5,
                ease: 'back.out(1.7)'
            });
            
            gsap.to(icon, {
                scale: 1.2,
                opacity: 0.6,
                duration: 0.3
            });
        });
        
        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                y: 0,
                boxShadow: '0 5px 20px rgba(0, 0, 0, 0.1)',
                duration: 0.3,
                ease: 'power2.out'
            });
            
            gsap.to(number, {
                scale: 1,
                rotation: 0,
                duration: 0.5,
                ease: 'back.out(1.7)'
            });
            
            gsap.to(icon, {
                scale: 1,
                opacity: 0.3,
                duration: 0.3
            });
        });
    });
    
    // Counter animation for process numbers
    document.querySelectorAll('.process-number').forEach(number => {
        const targetNumber = parseInt(number.textContent);
        
        ScrollTrigger.create({
            trigger: number,
            start: 'top 80%',
            onEnter: () => {
                gsap.from(number, {
                    textContent: 0,
                    duration: 1.5,
                    ease: 'power1.inOut',
                    snap: { textContent: 1 },
                    onUpdate: function() {
                        number.textContent = Math.ceil(this.targets()[0].textContent);
                    }
                });
            },
            once: true
        });
    });
    
    // ============================================
    // QUALITY SECTION ANIMATIONS
    // ============================================
    
    gsap.from('.quality-section .section-title', {
        scrollTrigger: {
            trigger: '.quality-section',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        },
        scale: 0.8,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
    });
    
    gsap.from('.quality-section .section-subtitle', {
        scrollTrigger: {
            trigger: '.quality-section',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        },
        y: 30,
        opacity: 0,
        duration: 1,
        delay: 0.3,
        ease: 'power3.out'
    });
    
    gsap.from('.quality-section .cta-button', {
        scrollTrigger: {
            trigger: '.quality-section',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        },
        scale: 0,
        opacity: 0,
        duration: 0.8,
        delay: 0.5,
        ease: 'back.out(1.7)'
    });
    
    // ============================================
    // INDUSTRIES SECTION ANIMATIONS
    // ============================================
    
    gsap.from('.industries-section .section-title', {
        scrollTrigger: {
            trigger: '.industries-section',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        },
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
    });
    
    // Industry cards with advanced stagger
    gsap.from('.industry-card', {
        scrollTrigger: {
            trigger: '.industries-grid',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        },
        y: 100,
        opacity: 0,
        rotationX: -15,
        duration: 1,
        stagger: {
            amount: 1,
            from: 'start',
            ease: 'power2.inOut'
        },
        ease: 'power3.out'
    });
    
    // Industry card hover effects
    document.querySelectorAll('.industry-card').forEach(card => {
        const image = card.querySelector('.industry-image');
        const overlay = card.querySelector('.industry-overlay');
        const button = card.querySelector('.learn-more');
        
        card.addEventListener('mouseenter', () => {
            gsap.to(card, {
                y: -15,
                boxShadow: '0 20px 50px rgba(0, 0, 0, 0.2)',
                duration: 0.4,
                ease: 'power2.out'
            });
            
            gsap.to(image, {
                scale: 1.1,
                duration: 0.6,
                ease: 'power2.out'
            });
            
            gsap.to(overlay, {
                opacity: 0.7,
                duration: 0.4
            });
            
            gsap.to(button, {
                x: 10,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
        
        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                y: 0,
                boxShadow: '0 5px 20px rgba(0, 0, 0, 0.1)',
                duration: 0.4,
                ease: 'power2.out'
            });
            
            gsap.to(image, {
                scale: 1,
                duration: 0.6,
                ease: 'power2.out'
            });
            
            gsap.to(overlay, {
                opacity: 1,
                duration: 0.4
            });
            
            gsap.to(button, {
                x: 0,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });
    
    // ============================================
    // CONTACT SECTION ANIMATIONS
    // ============================================
    
    gsap.from('.contact-section .section-title', {
        scrollTrigger: {
            trigger: '.contact-section',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        },
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
    });
    
    gsap.from('.contact-section .section-subtitle', {
        scrollTrigger: {
            trigger: '.contact-section',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        },
        y: 30,
        opacity: 0,
        duration: 1,
        delay: 0.2,
        ease: 'power3.out'
    });
    
    // Form elements animation
    gsap.from('.contact-form input, .contact-form select, .contact-form textarea', {
        scrollTrigger: {
            trigger: '.contact-form',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        },
        x: -50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out'
    });
    
    gsap.from('.contact-form button', {
        scrollTrigger: {
            trigger: '.contact-form',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        },
        scale: 0,
        opacity: 0,
        duration: 0.8,
        delay: 0.6,
        ease: 'back.out(1.7)'
    });
    
    // ============================================
    // FOOTER ANIMATIONS
    // ============================================
    
    gsap.from('.footer-section', {
        scrollTrigger: {
            trigger: '.footer',
            start: 'top 90%',
            toggleActions: 'play none none reverse'
        },
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: 'power3.out'
    });
    
    // ============================================
    // BUTTON ANIMATIONS
    // ============================================
    
    // Add magnetic effect to CTA buttons
    document.querySelectorAll('.cta-button, .learn-more').forEach(button => {
        button.addEventListener('mouseenter', (e) => {
            gsap.to(button, {
                scale: 1.05,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
        
        button.addEventListener('mouseleave', (e) => {
            gsap.to(button, {
                scale: 1,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
        
        button.addEventListener('mousemove', (e) => {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            gsap.to(button, {
                x: x * 0.3,
                y: y * 0.3,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
        
        button.addEventListener('mouseleave', () => {
            gsap.to(button, {
                x: 0,
                y: 0,
                duration: 0.5,
                ease: 'elastic.out(1, 0.3)'
            });
        });
    });
    
    // ============================================
    // SCROLL PROGRESS BAR
    // ============================================
    
    gsap.to('.scroll-progress', {
        scaleX: 1,
        transformOrigin: 'left',
        ease: 'none',
        scrollTrigger: {
            start: 'top top',
            end: 'max',
            scrub: 0.3
        }
    });
    
    // ============================================
    // SMOOTH SCROLL
    // ============================================
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                gsap.to(window, {
                    duration: 1.5,
                    scrollTo: {
                        y: target,
                        offsetY: 80
                    },
                    ease: 'power3.inOut'
                });
            }
        });
    });
}

// ============================================
// MOBILE MENU ANIMATIONS
// ============================================

const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-primary__links');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        const isActive = navMenu.classList.contains('active');
        
        if (!isActive) {
            navMenu.classList.add('active');
            hamburger.classList.add('active');
            
            // Beautiful staggered entrance animation
            gsap.from('.nav-primary__links li', {
                y: 30,
                opacity: 0,
                scale: 0.8,
                duration: 0.6,
                stagger: 0.1,
                ease: 'back.out(1.5)',
                clearProps: 'all'
            });
        } else {
            // Smooth exit animation
            gsap.to('.nav-primary__links li', {
                y: -20,
                opacity: 0,
                scale: 0.9,
                duration: 0.4,
                stagger: 0.05,
                ease: 'power3.in',
                onComplete: () => {
                    navMenu.classList.remove('active');
                    hamburger.classList.remove('active');
                }
            });
        }
    });
    
    // Close menu when clicking on links with animation
    document.querySelectorAll('.nav-primary__links a').forEach(link => {
        link.addEventListener('click', () => {
            gsap.to('.nav-primary__links li', {
                y: -20,
                opacity: 0,
                scale: 0.9,
                duration: 0.4,
                stagger: 0.05,
                ease: 'power3.in',
                onComplete: () => {
                    navMenu.classList.remove('active');
                    hamburger.classList.remove('active');
                }
            });
        });
    });
}

// ============================================
// FORM SUBMISSION ANIMATION
// ============================================

const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const button = contactForm.querySelector('button[type="submit"]');
        const originalText = button.textContent;
        
        // Animate button
        gsap.to(button, {
            scale: 0.9,
            duration: 0.1,
            yoyo: true,
            repeat: 1,
            onComplete: () => {
                button.textContent = 'Message Sent! ✓';
                gsap.to(button, {
                    backgroundColor: '#4caf50',
                    duration: 0.3
                });
                
                // Reset after 3 seconds
                setTimeout(() => {
                    contactForm.reset();
                    button.textContent = originalText;
                    gsap.to(button, {
                        backgroundColor: '',
                        duration: 0.3
                    });
                }, 3000);
            }
        });
    });
}

// ============================================
// PAGE LOAD ANIMATION
// ============================================

gsap.from('body', {
    opacity: 0,
    duration: 0.5,
    ease: 'power2.out'
});

// Add scroll progress bar element
const scrollProgress = document.createElement('div');
scrollProgress.className = 'scroll-progress';
scrollProgress.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    height: 3px;
    background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
    z-index: 10000;
    transform-origin: left;
    transform: scaleX(0);
    width: 100%;
`;
    document.body.appendChild(scrollProgress);

    console.log('🚀 GSAP Animations Initialized Successfully!');

} // End of initGSAPAnimations function

    // Call the initialization function
    initGSAPAnimations();

});
