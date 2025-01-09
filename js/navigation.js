class Navigation {
    constructor() {
        // Initialize elements
        this.nav = document.querySelector('.main-nav');
        this.menuToggle = document.querySelector('.menu-toggle');
        this.navLinks = document.querySelector('.nav-links');
        this.links = document.querySelectorAll('.nav-links a');
        this.currentPath = window.location.pathname;
        this.lastScroll = 0;
        this.isMenuOpen = false;

        // Initialize navigation
        this.init();
    }

    init() {
        // Set up event listeners
        this.bindEvents();
        
        // Set initial active state
        this.setActiveLink();
        
        // Add scroll animations
        this.setupScrollAnimations();
        
        // Check for mobile
        this.checkMobile();
    }

    bindEvents() {
        // Menu toggle click
        if (this.menuToggle) {
            this.menuToggle.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleMenu();
            });
        }

        // Window scroll
        window.addEventListener('scroll', this.debounce(() => {
            this.handleScroll();
        }, 10));

        // Window resize
        window.addEventListener('resize', this.debounce(() => {
            this.handleResize();
        }, 250));

        // Click outside menu
        document.addEventListener('click', (e) => {
            if (this.isMenuOpen && !this.nav.contains(e.target)) {
                this.closeMenu();
            }
        });

        // Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isMenuOpen) {
                this.closeMenu();
            }
        });

        // Link clicks
        this.links.forEach(link => {
            link.addEventListener('click', (e) => {
                this.handleLinkClick(e);
            });
        });
    }

    toggleMenu() {
        this.isMenuOpen = !this.isMenuOpen;
        this.menuToggle.classList.toggle('active');
        this.navLinks.classList.toggle('active');
        document.body.classList.toggle('menu-open');

        if (this.isMenuOpen) {
            this.animateMenuItems();
        }
    }

    closeMenu() {
        if (this.isMenuOpen) {
            this.isMenuOpen = false;
            this.menuToggle.classList.remove('active');
            this.navLinks.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    }

    handleScroll() {
        const currentScroll = window.pageYOffset;

        // Handle nav visibility
        if (currentScroll > this.lastScroll && currentScroll > 100) {
            // Scrolling down - hide nav
            this.nav.classList.add('nav-hidden');
        } else {
            // Scrolling up - show nav
            this.nav.classList.remove('nav-hidden');
        }

        // Add background when scrolled
        if (currentScroll > 50) {
            this.nav.classList.add('scrolled');
        } else {
            this.nav.classList.remove('scrolled');
        }

        this.lastScroll = currentScroll;
        this.updateActiveSection();
    }

    handleResize() {
        if (window.innerWidth > 768) {
            this.closeMenu();
            this.navLinks.style.display = 'flex';
        }
    }

    handleLinkClick(e) {
        const link = e.currentTarget;
        const href = link.getAttribute('href');

        // Handle same-page links
        if (href.startsWith('#')) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                this.scrollToElement(target);
                this.closeMenu();
            }
        } else {
            // Regular page navigation
            this.closeMenu();
        }
    }

    scrollToElement(element) {
        const navHeight = this.nav.offsetHeight;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - navHeight;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }

    updateActiveSection() {
        const sections = document.querySelectorAll('.scroll-section');
        const navHeight = this.nav.offsetHeight;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - navHeight - 100;
            const sectionBottom = sectionTop + section.offsetHeight;
            const scroll = window.pageYOffset;
            const id = section.getAttribute('id');

            if (scroll >= sectionTop && scroll < sectionBottom) {
                this.setActiveLinkById(id);
            }
        });
    }

    setActiveLink() {
        this.links.forEach(link => {
            const href = link.getAttribute('href');
            if (href === this.currentPath || href === this.currentPath + '/') {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    setActiveLinkById(id) {
        if (!id) return;

        this.links.forEach(link => {
            const href = link.getAttribute('href');
            if (href === `#${id}`) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    animateMenuItems() {
        const menuItems = this.navLinks.children;
        Array.from(menuItems).forEach((item, index) => {
            item.style.animation = `fadeInRight 0.5s ease forwards ${index * 0.1}s`;
        });
    }

    setupScrollAnimations() {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-in');
                    }
                });
            },
            {
                threshold: 0.1,
                rootMargin: '-50px'
            }
        );

        // Observe navigation elements
        this.links.forEach(link => observer.observe(link));
    }

    checkMobile() {
        const isMobile = window.innerWidth <= 768;
        if (isMobile) {
            this.nav.classList.add('mobile');
            this.setupMobileNav();
        } else {
            this.nav.classList.remove('mobile');
        }
    }

    setupMobileNav() {
        // Add swipe detection
        let touchStartX = 0;
        let touchEndX = 0;

        document.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });

        document.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe();
        });
    }

    handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchEndX - touchStartX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0 && !this.isMenuOpen) {
                // Swipe right - open menu
                this.toggleMenu();
            } else if (diff < 0 && this.isMenuOpen) {
                // Swipe left - close menu
                this.closeMenu();
            }
        }
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
    const navigation = new Navigation();
});

export default Navigation;
