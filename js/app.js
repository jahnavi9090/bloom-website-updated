class App {
    constructor() {
        // Initialize core components
        this.initializeComponents();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Check user preferences
        this.checkUserPreferences();
        
        // Initialize page-specific features
        this.initializePageFeatures();
    }

    initializeComponents() {
        // Navigation
        this.nav = document.querySelector('.main-nav');
        this.menuToggle = document.querySelector('.menu-toggle');
        this.navLinks = document.querySelector('.nav-links');
        
        // Progress bar
        this.progressBar = document.querySelector('.progress-bar');
        
        // Forms
        this.contactForm = document.getElementById('contactForm');
        
        // Page elements
        this.scrollSections = document.querySelectorAll('.scroll-section');
        this.animatedElements = document.querySelectorAll('.animate');
    }

    setupEventListeners() {
        // Navigation events
        if (this.menuToggle) {
            this.menuToggle.addEventListener('click', () => this.toggleMenu());
        }

        // Scroll events
        window.addEventListener('scroll', () => this.handleScroll());

        // Form submission
        if (this.contactForm) {
            this.contactForm.addEventListener('submit', (e) => this.handleFormSubmit(e));
        }

        // Click events
        document.addEventListener('click', (e) => this.handleDocumentClick(e));

        // Resize events
        window.addEventListener('resize', this.debounce(() => this.handleResize(), 250));

        // Escape key to close menu
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.closeMenu();
        });
    }

    toggleMenu() {
        this.menuToggle.classList.toggle('active');
        this.navLinks.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    }

    closeMenu() {
        this.menuToggle?.classList.remove('active');
        this.navLinks?.classList.remove('active');
        document.body.classList.remove('menu-open');
    }

    handleScroll() {
        // Update progress bar
        this.updateProgressBar();
        
        // Handle navigation visibility
        this.handleNavVisibility();
        
        // Animate elements on scroll
        this.animateOnScroll();
        
        // Update active section
        this.updateActiveSection();
    }

    updateProgressBar() {
        if (this.progressBar) {
            const scrolled = window.pageYOffset;
            const total = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (scrolled / total) * 100;
            this.progressBar.style.width = `${progress}%`;
        }
    }

    handleNavVisibility() {
        if (window.scrollY > 100) {
            this.nav?.classList.add('scrolled');
        } else {
            this.nav?.classList.remove('scrolled');
        }
    }

    animateOnScroll() {
        this.animatedElements.forEach(element => {
            if (this.isElementInViewport(element)) {
                element.classList.add('animated');
            }
        });
    }

    updateActiveSection() {
        this.scrollSections.forEach(section => {
            if (this.isElementInViewport(section)) {
                const id = section.getAttribute('id');
                this.updateActiveLink(id);
            }
        });
    }

    updateActiveLink(id) {
        const links = document.querySelectorAll('.nav-links a');
        links.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(id)) {
                link.classList.add('active');
            }
        });
    }

    async handleFormSubmit(e) {
        e.preventDefault();
        
        try {
            const form = e.target;
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());

            // Validate form data
            if (!this.validateForm(data)) {
                throw new Error('Please fill in all required fields.');
            }

            // Show loading state
            this.showLoading(form);

            // Simulate API call (replace with actual API call)
            await this.simulateApiCall();

            // Show success message
            this.showSuccess(form);
            form.reset();

        } catch (error) {
            this.showError(error.message);
        }
    }

    validateForm(data) {
        return Object.values(data).every(value => value.trim() !== '');
    }

    showLoading(form) {
        const button = form.querySelector('button[type="submit"]');
        if (button) {
            button.disabled = true;
            button.innerHTML = 'Sending...';
        }
    }

    async simulateApiCall() {
        return new Promise(resolve => setTimeout(resolve, 1000));
    }

    showSuccess(form) {
        const button = form.querySelector('button[type="submit"]');
        if (button) {
            button.disabled = false;
            button.innerHTML = 'Send Message';
        }

        const successMessage = document.getElementById('successMessage');
        if (successMessage) {
            successMessage.style.display = 'block';
            setTimeout(() => {
                successMessage.style.display = 'none';
            }, 5000);
        }
    }

    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        document.body.appendChild(errorDiv);

        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }

    isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.75 &&
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

    checkUserPreferences() {
        // Check for dark mode preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
        if (prefersDark.matches) {
            document.body.classList.add('dark-mode');
        }

        // Check for reduced motion preference
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        if (prefersReducedMotion.matches) {
            document.body.classList.add('reduce-motion');
        }
    }

    initializePageFeatures() {
        // Initialize page-specific features based on current page
        const currentPage = window.location.pathname;

        if (currentPage.includes('services')) {
            this.initializeServiceFeatures();
        } else if (currentPage.includes('about')) {
            this.initializeAboutFeatures();
        } else if (currentPage.includes('contact')) {
            this.initializeContactFeatures();
        }
    }

    initializeServiceFeatures() {
        // Initialize service page specific features
        const serviceCards = document.querySelectorAll('.service-card');
        serviceCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-10px)';
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
            });
        });
    }

    initializeAboutFeatures() {
        // Initialize about page specific features
        const teamMembers = document.querySelectorAll('.team-member');
        teamMembers.forEach(member => {
            member.addEventListener('click', () => {
                member.classList.toggle('expanded');
            });
        });
    }

    initializeContactFeatures() {
        // Initialize contact page specific features
        const inputs = document.querySelectorAll('.contact-form input, .contact-form textarea');
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                input.parentElement.classList.add('focused');
            });
            input.addEventListener('blur', () => {
                if (!input.value) {
                    input.parentElement.classList.remove('focused');
                }
            });
        });
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
});

export default App;
