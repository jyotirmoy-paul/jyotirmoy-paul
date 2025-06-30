// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Initialize all components
    initializeNavigation();
    initializeSystemTheme();
    initializeScrollEffects();
    initializeAnimations();
    initializeMobileMenu();
    initializeTypingEffect();
}

// Navigation functionality
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    
    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
            
            // Close mobile menu if open
            const navMenu = document.querySelector('.nav-menu');
            const navToggle = document.querySelector('.nav-toggle');
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });
    
    // Update active navigation link on scroll
    function updateActiveNavLink() {
        let current = '';
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        // Remove active class from all links first
        navLinks.forEach(link => {
            link.classList.remove('active');
        });
        
        // Add active class only to the current section's link
        if (current) {
            const activeLink = document.querySelector(`.nav-link[href="#${current}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
        }
    }
    
    // Throttle scroll event for performance
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        scrollTimeout = setTimeout(updateActiveNavLink, 10);
    });
}

// System theme functionality
function initializeSystemTheme() {
    const body = document.body;
    
    // Function to detect and apply system theme
    function applySystemTheme() {
        // Check if browser supports matchMedia
        if (!window.matchMedia) {
            console.warn('matchMedia not supported, defaulting to light theme');
            body.setAttribute('data-theme', 'light');
            return;
        }
        
        // Create media query for dark mode
        const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const lightModeQuery = window.matchMedia('(prefers-color-scheme: light)');
        
        // Debug logging
        console.log('Dark mode query matches:', darkModeQuery.matches);
        console.log('Light mode query matches:', lightModeQuery.matches);
        console.log('User agent:', navigator.userAgent);
        
        // Apply theme based on system preference
        if (darkModeQuery.matches) {
            body.setAttribute('data-theme', 'dark');
            console.log('Applied dark theme');
        } else if (lightModeQuery.matches) {
            body.setAttribute('data-theme', 'light');
            console.log('Applied light theme');
        } else {
            // Fallback for browsers that don't support prefers-color-scheme
            console.warn('No color scheme preference detected, defaulting to light theme');
            body.setAttribute('data-theme', 'light');
        }
    }
    
    // Apply initial system theme
    applySystemTheme();
    
    // Listen for system theme changes with enhanced support
    if (window.matchMedia) {
        try {
            // Create separate listeners for both dark and light mode
            const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
            const lightModeQuery = window.matchMedia('(prefers-color-scheme: light)');
            
            // Use modern addEventListener if available, fallback to addListener
            const addListener = (query, handler) => {
                if (query.addEventListener) {
                    query.addEventListener('change', handler);
                } else if (query.addListener) {
                    // Legacy Safari support
                    query.addListener(handler);
                }
            };
            
            addListener(darkModeQuery, function(e) {
                console.log('Dark mode change detected:', e.matches);
                if (e.matches) {
                    body.setAttribute('data-theme', 'dark');
                }
            });
            
            addListener(lightModeQuery, function(e) {
                console.log('Light mode change detected:', e.matches);
                if (e.matches) {
                    body.setAttribute('data-theme', 'light');
                }
            });
            
        } catch (error) {
            console.error('Error setting up theme change listeners:', error);
        }
    }
    
    // Remove any saved theme preference since we're using system only
    localStorage.removeItem('theme');
    
    // Additional CSS media query fallback
    if (document.styleSheets && document.styleSheets.length > 0) {
        try {
            // Check if CSS media queries are working
            const testQuery = window.matchMedia('(prefers-color-scheme: dark)');
            console.log('CSS media query test:', testQuery.media, testQuery.matches);
        } catch (error) {
            console.error('CSS media query test failed:', error);
        }
    }
}

// Scroll effects
function initializeScrollEffects() {
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// Animation on scroll
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.hero-content, .about-highlights, .timeline-item, .project-card, .skill-category, .writing-link, .contact-item');
    
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // Stagger animation for grid items
    const gridItems = document.querySelectorAll('.projects-grid .project-card, .skills-grid .skill-category, .about-highlights .highlight-item');
    gridItems.forEach((item, index) => {
        item.style.transitionDelay = `${index * 0.1}s`;
    });
}

// Mobile menu functionality
function initializeMobileMenu() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    navToggle.addEventListener('click', function() {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
    
    // Close menu on window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
}

// Typing effect for hero title
function initializeTypingEffect() {
    const heroTitle = document.getElementById('heroTitle');
    const texts = [
        'Senior Flutter Developer',
        'Mobile Architecture Expert',
        'System Design Enthusiast',
        'Open Source Contributor',
    ];
    
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;
    
    function typeEffect() {
        const currentText = texts[textIndex];
        
        if (isDeleting) {
            heroTitle.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            heroTitle.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100;
        }
        
        if (!isDeleting && charIndex === currentText.length) {
            isDeleting = true;
            typingSpeed = 2000; // Pause at end
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            typingSpeed = 500; // Longer pause before next text
        }
        
        setTimeout(typeEffect, typingSpeed);
    }
    
    // Start typing effect with delay
    setTimeout(typeEffect, 1000);
}

// Smooth reveal animations for sections
function revealOnScroll() {
    const reveals = document.querySelectorAll('.timeline-item, .project-card, .skill-category');
    
    reveals.forEach(reveal => {
        const windowHeight = window.innerHeight;
        const revealTop = reveal.getBoundingClientRect().top;
        const revealPoint = 150;
        
        if (revealTop < windowHeight - revealPoint) {
            reveal.classList.add('active');
        }
    });
}

window.addEventListener('scroll', revealOnScroll);

// Add hover effects to interactive elements
function initializeHoverEffects() {
    // Project cards tilt effect
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) rotate(1deg)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) rotate(0deg)';
        });
    });
    
    // Skill items pulse effect
    const skillItems = document.querySelectorAll('.skill-item');
    
    skillItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            const icon = this.querySelector('i');
            icon.style.transform = 'scale(1.2) rotate(5deg)';
            icon.style.transition = 'transform 0.3s ease';
        });
        
        item.addEventListener('mouseleave', function() {
            const icon = this.querySelector('i');
            icon.style.transform = 'scale(1) rotate(0deg)';
        });
    });
}

// Initialize hover effects after DOM load
document.addEventListener('DOMContentLoaded', initializeHoverEffects);

// Particle animation for hero section
function initializeParticles() {
    const hero = document.querySelector('.hero');
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        createParticle(hero);
    }
}

function createParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.cssText = `
        position: absolute;
        width: 2px;
        height: 2px;
        background: var(--primary-color);
        border-radius: 50%;
        pointer-events: none;
        opacity: 0.3;
        animation: float 6s linear infinite;
    `;
    
    // Random position
    particle.style.left = Math.random() * 100 + '%';
    particle.style.animationDelay = Math.random() * 6 + 's';
    particle.style.animationDuration = (Math.random() * 3 + 3) + 's';
    
    container.appendChild(particle);
    
    // Remove particle after animation
    setTimeout(() => {
        if (particle.parentNode) {
            particle.parentNode.removeChild(particle);
        }
    }, 6000);
}

// Add CSS for particles
const style = document.createElement('style');
style.textContent = `
    @keyframes float {
        0% {
            transform: translateY(100vh) rotate(0deg);
            opacity: 0;
        }
        10% {
            opacity: 0.3;
        }
        90% {
            opacity: 0.3;
        }
        100% {
            transform: translateY(-100px) rotate(360deg);
            opacity: 0;
        }
    }
    
    .particle {
        z-index: 1;
    }
`;
document.head.appendChild(style);

// Initialize particles with delay
setTimeout(initializeParticles, 2000);

// Copy email functionality
function initializeCopyEmail() {
    const emailLink = document.querySelector('a[href^="mailto:"]');
    
    if (emailLink) {
        emailLink.addEventListener('click', function(e) {
            e.preventDefault();
            const email = this.href.replace('mailto:', '');
            
            if (navigator.clipboard) {
                navigator.clipboard.writeText(email).then(() => {
                    showToast('Email copied to clipboard!');
                });
            } else {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = email;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                showToast('Email copied to clipboard!');
            }
        });
    }
}

// Toast notification
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: var(--primary-color);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: var(--shadow-lg);
        z-index: 1000;
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.3s ease;
    `;
    
    document.body.appendChild(toast);
    
    // Show toast
    setTimeout(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateY(0)';
    }, 100);
    
    // Hide toast
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(20px)';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, 3000);
}

// Initialize copy email functionality
document.addEventListener('DOMContentLoaded', initializeCopyEmail);

// Performance optimization: Lazy load images
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize all optimizations
document.addEventListener('DOMContentLoaded', initializeLazyLoading);

// Console Easter Egg
console.log(`
🚀 Welcome to Jyotirmoy Paul's Portfolio!

Hey there, fellow developer! 👋
Thanks for checking out the source code.

If you're interested in:
- Flutter Development
- Mobile Architecture
- System Design
- Building cool stuff

Let's connect! 
📧 me@jyotirmoypaul.com
🔗 LinkedIn: https://linkedin.com/in/mr-jyotirmoy-paul
`);

// Add a fun konami code easter egg
let konamiCode = [];
const konamiSequence = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'KeyB', 'KeyA'
];

document.addEventListener('keydown', function(e) {
    konamiCode.push(e.code);
    
    if (konamiCode.length > konamiSequence.length) {
        konamiCode.shift();
    }
    
    if (konamiCode.join(',') === konamiSequence.join(',')) {
        showToast('Konami Code activated! You found the easter egg!');
        // Add some fun visual effect
        document.body.style.animation = 'rainbow 10s ease-in-out';
        setTimeout(() => {
            document.body.style.animation = '';
        }, 10000);
    }
});

// Add rainbow animation CSS
const rainbowStyle = document.createElement('style');
rainbowStyle.textContent = `
    @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        100% { filter: hue-rotate(360deg); }
    }
`;
document.head.appendChild(rainbowStyle);