// ============================================
// ADVANCED SCROLL & INTERACTION EFFECTS
// ============================================

// Smooth scroll behavior for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ============================================
// INTERSECTION OBSERVER FOR SCROLL REVEAL
// ============================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = `fadeInUp 0.8s ease-out forwards`;
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe feature cards
document.querySelectorAll('.feature-card').forEach(card => {
    observer.observe(card);
});

// ============================================
// PARALLAX SCROLL EFFECT
// ============================================

let scrollY = 0;
let ticking = false;

function updateParallax() {
    const glowOrbs = document.querySelectorAll('.glow-orb');
    const waveContainer = document.querySelector('.wave-container');
    
    glowOrbs.forEach((orb, index) => {
        const speed = 0.5 + (index * 0.1);
        orb.style.transform = `translateY(${scrollY * speed}px)`;
    });
    
    if (waveContainer) {
        waveContainer.style.transform = `translateY(${scrollY * 0.3}px)`;
    }
    
    ticking = false;
}

function onScroll() {
    scrollY = window.pageYOffset;
    
    if (!ticking) {
        window.requestAnimationFrame(updateParallax);
        ticking = true;
    }
}

window.addEventListener('scroll', onScroll, { passive: true });

// ============================================
// SCROLL INDICATOR HIDE/SHOW
// ============================================

const scrollIndicator = document.querySelector('.scroll-indicator');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        scrollIndicator.style.opacity = '0';
        scrollIndicator.style.pointerEvents = 'none';
    } else {
        scrollIndicator.style.opacity = '1';
        scrollIndicator.style.pointerEvents = 'auto';
    }
}, { passive: true });

// ============================================
// BUTTON INTERACTIONS
// ============================================

const buttons = document.querySelectorAll('.btn, .cta-button, .nav-link');

buttons.forEach(button => {
    button.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-3px)';
    });
    
    button.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
    
    button.addEventListener('mousedown', function() {
        this.style.transform = 'translateY(-1px)';
    });
    
    button.addEventListener('mouseup', function() {
        this.style.transform = 'translateY(-3px)';
    });
});

// ============================================
// NAVBAR BACKGROUND ON SCROLL
// ============================================

const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 50) {
        navbar.style.background = 'rgba(0, 0, 0, 0.9)';
        navbar.style.borderBottomColor = 'rgba(0, 112, 243, 0.2)';
    } else {
        navbar.style.background = 'rgba(0, 0, 0, 0.7)';
        navbar.style.borderBottomColor = 'rgba(255, 255, 255, 0.1)';
    }
}, { passive: true });

// ============================================
// MOUSE GLOW EFFECT (Optional)
// ============================================

document.addEventListener('mousemove', (e) => {
    const glowOrbs = document.querySelectorAll('.glow-orb');
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;
    
    glowOrbs.forEach((orb, index) => {
        const speed = 0.02 + (index * 0.01);
        orb.style.transform = `translate(${x * 50 * speed}px, ${y * 50 * speed}px)`;
    });
});

// ============================================
// PERFORMANCE OPTIMIZATION
// ============================================

// Debounce function for resize events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Handle window resize
const handleResize = debounce(() => {
    // Recalculate positions if needed
}, 250);

window.addEventListener('resize', handleResize);

// ============================================
// LAZY LOADING FOR IMAGES (Future Enhancement)
// ============================================

if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ============================================
// ACTIVE NAVIGATION LINK
// ============================================

function updateActiveLink() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
            link.style.color = 'var(--text-primary)';
        } else {
            link.style.color = 'var(--text-secondary)';
        }
    });
}

window.addEventListener('scroll', updateActiveLink, { passive: true });

// ============================================
// INITIAL ANIMATIONS ON PAGE LOAD
// ============================================

window.addEventListener('load', () => {
    // Add loaded class to body
    document.body.classList.add('loaded');
    
    // Trigger initial animations
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.animation = 'fadeInUp 0.8s ease-out 0.2s both';
    }
});

// ============================================
// KEYBOARD NAVIGATION
// ============================================

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') {
        window.scrollBy({
            top: 100,
            behavior: 'smooth'
        });
    } else if (e.key === 'ArrowUp') {
        window.scrollBy({
            top: -100,
            behavior: 'smooth'
        });
    }
});

// ============================================
// TOUCH OPTIMIZATION FOR MOBILE
// ============================================

let lastTouchY = 0;

document.addEventListener('touchstart', (e) => {
    lastTouchY = e.touches[0].clientY;
}, { passive: true });

document.addEventListener('touchmove', (e) => {
    const currentY = e.touches[0].clientY;
    const diff = lastTouchY - currentY;
    
    if (Math.abs(diff) > 5) {
        lastTouchY = currentY;
    }
}, { passive: true });

// ============================================
// CONSOLE GREETING
// ============================================

console.log('%c🎨 Welcome to Our Platform!', 'font-size: 20px; color: #0070f3; font-weight: bold;');
console.log('%cBuilt with advanced animations and smooth interactions', 'color: #3291ff; font-size: 14px;');
console.log('%cHover over elements and scroll to see the magic ✨', 'color: #dddddd; font-size: 12px;');

// ============================================
// READY STATE
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('%cPage is ready! Enjoy the experience 🚀', 'color: #2ed573; font-weight: bold;');
});
