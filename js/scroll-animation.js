class ScrollAnimation {
    constructor() {
        // Initialize properties
        this.sections = document.querySelectorAll('.scroll-section');
        this.animatedElements = document.querySelectorAll('.animate');
        this.parallaxElements = document.querySelectorAll('.parallax');
        this.fadeElements = document.querySelectorAll('.fade-in');
        this.slideElements = document.querySelectorAll('.slide-in');
        this.scaleElements = document.querySelectorAll('.scale-in');
        
        // Animation states
        this.currentSection = 0;
        this.isAnimating = false;
        this.lastScrollTop = 0;
        this.scrollDirection = 'down';
        
        // Touch handling
        this.touchStartY = 0;
        this.touchEndY = 0;
        
        // Initialize
        this.init();
    }

    init() {
        // Set up observers
        this.setupIntersectionObserver();
        this.setupScrollObserver();
        
        // Bind event listeners
        this.bindEvents();
        
        // Initial animations
        this.animateOnLoad();
    }

    bindEvents() {
        // Scroll events
        window.addEventListener('scroll', this.debounce(() => {
            this.handleScroll();
        }, 10));

        // Resize events
        window.addEventListener('resize', this.debounce(() => {
            this.handleResize();
        }, 250));

        // Touch events for mobile
        document.addEventListener('touchstart', (e) => {
            this.touchStartY = e.touches[0].clientY;
        });

        document.addEventListener('touchend', (e) => {
            this.touchEndY = e.changedTouches[0].clientY;
            this.handleTouchMove();
        });
    }

    setupIntersectionObserver() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '-50px'
        });

        // Observe all animated elements
        this.animatedElements.forEach(element => {
            this.observer.observe(element);
        });
    }

    setupScrollObserver() {
        this.scrollObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    this.updateActiveSection(entry.target);
                }
            });
        }, {
            threshold: 0.5
        });

        // Observe all sections
        this.sections.forEach(section => {
            this.scrollObserver.observe(section);
        });
    }

    handleScroll() {
        // Determine scroll direction
        const st = window.pageYOffset;
        this.scrollDirection = st > this.lastScrollTop ? 'down' : 'up';
        this.lastScrollTop = st;

        // Update parallax effects
        this.updateParallax();

        // Animate elements in viewport
        this.animateElementsInView();

        // Handle scroll-based animations
        requestAnimationFrame(() => {
            this.handleScrollAnimations();
        });
    }

    handleScrollAnimations() {
        const scroll = window.pageYOffset;

        // Fade elements
        this.fadeElements.forEach(element => {
            const elementTop = element.offsetTop;
            const elementHeight = element.offsetHeight;
            const viewportHeight = window.innerHeight;

            if (scroll > elementTop - viewportHeight + elementHeight / 2) {
                element.classList.add('fade-in-active');
            }
        });

        // Slide elements
        this.slideElements.forEach(element => {
            const elementTop = element.offsetTop;
            if (scroll > elementTop - window.innerHeight * 0.8) {
                element.classList.add('slide-in-active');
            }
        });

        // Scale elements
        this.scaleElements.forEach(element => {
            const elementTop = element.offsetTop;
            if (scroll > elementTop - window.innerHeight * 0.8) {
                element.classList.add('scale-in-active');
            }
        });
    }

    updateParallax() {
        this.parallaxElements.forEach(element => {
            const speed = element.dataset.speed || 0.5;
            const yPos = -(window.pageYOffset * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    }

    animateElement(element) {
        // Get animation type from data attribute
        const animationType = element.dataset.animation || 'fade';
        const delay = element.dataset.delay || 0;
        const duration = element.dataset.duration || '0.5s';

        // Set animation properties
        element.style.animationDelay = `${delay}s`;
        element.style.animationDuration = duration;
        element.classList.add('animated', animationType);
    }

    animateElementsInView() {
        this.animatedElements.forEach(element => {
            if (this.isElementInViewport(element)) {
                this.animateElement(element);
            }
        });
    }

    animateOnLoad() {
        // Animate elements visible on page load
        this.animatedElements.forEach(element => {
            if (this.isElementInViewport(element)) {
                this.animateElement(element);
            }
        });
    }

    handleResize() {
        // Update animations on resize
        this.animateElementsInView();
        this.updateParallax();
    }

    handleTouchMove() {
        const diff = this.touchStartY - this.touchEndY;
        const threshold = 50;

        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                // Swipe up
                this.scrollToNextSection();
            } else {
                // Swipe down
                this.scrollToPrevSection();
            }
        }
    }

    scrollToNextSection() {
        if (this.currentSection < this.sections.length - 1) {
            this.currentSection++;
            this.scrollToSection(this.currentSection);
        }
    }

    scrollToPrevSection() {
        if (this.currentSection > 0) {
            this.currentSection--;
            this.scrollToSection(this.currentSection);
        }
    }

    scrollToSection(index) {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        const section = this.sections[index];
        
        section.scrollIntoView({
            behavior: 'smooth'
        });

        setTimeout(() => {
            this.isAnimating = false;
        }, 1000);
    }

    updateActiveSection(section) {
        this.sections.forEach((s, index) => {
            if (s === section) {
                this.currentSection = index;
            }
        });
    }

    isElementInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8 &&
            rect.bottom >= 0
        );
    }

    debounce(func, wait) {
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
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const scrollAnimation = new ScrollAnimation();
});

export default ScrollAnimation;
