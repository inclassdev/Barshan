// Enhanced Portfolio JavaScript with Advanced Animations - Barshan's Portfolio - FIXED VERSION
(function() {
    'use strict';

    // Performance optimizations
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Animation configuration
    const ANIMATION_CONFIG = {
        duration: {
            fast: prefersReducedMotion ? 50 : 200,
            normal: prefersReducedMotion ? 100 : 300,
            slow: prefersReducedMotion ? 150 : 500,
            typewriter: prefersReducedMotion ? 50 : 100
        }
    };

    // Wait for DOM to be fully loaded
    document.addEventListener('DOMContentLoaded', function() {
        console.log('Enhanced Portfolio app starting...');
        
        // DOM elements
        const navLinks = document.querySelectorAll('.nav__link');
        const sections = document.querySelectorAll('.section');
        const themeToggle = document.getElementById('themeToggle');
        const navToggle = document.getElementById('navToggle');
        const navMenu = document.getElementById('navMenu');
        const contactForm = document.getElementById('contactForm');
        const loadingScreen = document.getElementById('loadingScreen');
        const heroButtons = document.querySelectorAll('.hero__actions .btn');
        const typewriterElement = document.querySelector('.typewriter');

        // Animation observers
        let intersectionObserver;
        let skillsAnimated = false;
        let timelineAnimated = false;

        // State
        let currentSection = 'home';
        let isAnimating = false;

        console.log('Found elements:', {
            navLinks: navLinks.length,
            sections: sections.length,
            themeToggle: !!themeToggle,
            heroButtons: heroButtons.length,
            typewriter: !!typewriterElement
        });

        // Initialize app
        init();

        function init() {
            console.log('Initializing enhanced portfolio...');
            
            // Set initial theme
            const savedTheme = localStorage.getItem('theme') || 'dark';
            setTheme(savedTheme, false);
            
            // Initialize components
            setupNavigation();
            setupHeroButtons();
            setupThemeToggle();
            setupMobileMenu();
            setupScrollAnimations();
            setupContactForm();
            setupSkillsAnimation();
            setupRippleEffects();
            
            // Show loading screen initially and then start app
            showLoadingScreen();
            
            setTimeout(() => {
                hideLoadingScreen();
                startApplication();
            }, 1500);
            
            console.log('Enhanced portfolio initialized successfully');
        }

        function startApplication() {
            // Show home section initially
            showSection('home');
            
            // Start initial animations
            setTimeout(() => {
                startInitialAnimations();
                setupTypewriterEffect();
                animateNavigation();
            }, 300);
        }

        function animateNavigation() {
            // Animate navigation elements
            const navElements = document.querySelectorAll('.animate-slide-down');
            navElements.forEach((el, index) => {
                setTimeout(() => {
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                }, index * 100);
            });
        }

        // Enhanced loading screen
        function showLoadingScreen() {
            if (loadingScreen) {
                loadingScreen.classList.remove('hidden');
            }
        }

        function hideLoadingScreen() {
            if (loadingScreen) {
                loadingScreen.classList.add('hidden');
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                }, 500);
            }
        }

        // Enhanced navigation with smooth transitions
        function setupNavigation() {
            console.log('Setting up enhanced navigation...');
            
            navLinks.forEach((link, index) => {
                console.log(`Setting up nav link ${index}:`, link.getAttribute('href'));
                link.addEventListener('click', handleNavClick);
                
                // Add enhanced hover effects
                setupNavLinkAnimations(link);
            });

            // Handle hash changes (browser back/forward)
            window.addEventListener('hashchange', handleHashChange);
            
            // Handle initial hash
            const initialHash = window.location.hash.substring(1);
            if (initialHash && initialHash !== 'home' && initialHash !== '') {
                setTimeout(() => {
                    navigateToSection(initialHash);
                }, 100);
            }
        }

        function setupNavLinkAnimations(link) {
            const underline = link.querySelector('.nav__link-underline');
            
            link.addEventListener('mouseenter', () => {
                if (!prefersReducedMotion && underline) {
                    underline.style.transformOrigin = 'left';
                }
            });
            
            link.addEventListener('mouseleave', () => {
                if (!prefersReducedMotion && underline) {
                    underline.style.transformOrigin = 'right';
                }
            });
        }

        function setupHeroButtons() {
            console.log('Setting up enhanced hero buttons...');
            
            heroButtons.forEach((button, index) => {
                console.log(`Setting up hero button ${index}:`, button.getAttribute('href'));
                button.addEventListener('click', function(e) {
                    e.preventDefault();
                    const targetSection = this.getAttribute('href').substring(1);
                    console.log('Hero button clicked, navigating to:', targetSection);
                    
                    // Add click animation
                    animateButtonClick(this);
                    
                    setTimeout(() => {
                        navigateToSection(targetSection);
                    }, 200);
                });
            });
        }

        function handleNavClick(e) {
            e.preventDefault();
            if (isAnimating) return;
            
            const targetId = e.currentTarget.getAttribute('href').substring(1);
            console.log('Nav link clicked, navigating to:', targetId);
            
            // Add click animation
            animateNavLinkClick(e.currentTarget);
            
            navigateToSection(targetId);
            
            // Close mobile menu if open
            if (navMenu && navMenu.classList.contains('active')) {
                closeMobileMenu();
            }
        }

        function handleHashChange() {
            const hash = window.location.hash.substring(1) || 'home';
            console.log('Hash changed to:', hash);
            if (hash !== currentSection && !isAnimating) {
                navigateToSection(hash);
            }
        }

        function navigateToSection(sectionId) {
            if (isAnimating) return;
            
            console.log('Navigating to section with enhanced animation:', sectionId);
            
            const targetSection = document.getElementById(sectionId);
            if (!targetSection) {
                console.error('Target section not found:', sectionId);
                return;
            }

            isAnimating = true;

            // Update URL
            if (window.location.hash !== `#${sectionId}`) {
                history.pushState(null, null, `#${sectionId}`);
            }

            // Enhanced section transition
            transitionToSection(sectionId).then(() => {
                // Update navigation
                updateActiveNavLink(sectionId);

                // Trigger section-specific animations
                setTimeout(() => {
                    triggerSectionAnimations(sectionId);
                    isAnimating = false;
                }, 200);
            });
        }

        function transitionToSection(sectionId) {
            return new Promise((resolve) => {
                // Hide current section with fade out animation
                const currentSectionEl = document.getElementById(currentSection);
                if (currentSectionEl && currentSectionEl !== document.getElementById(sectionId)) {
                    currentSectionEl.style.transform = 'translateY(-20px)';
                    currentSectionEl.style.opacity = '0';
                    
                    setTimeout(() => {
                        currentSectionEl.classList.remove('active');
                        showSectionWithAnimation(sectionId);
                        resolve();
                    }, 300);
                } else {
                    showSectionWithAnimation(sectionId);
                    resolve();
                }
            });
        }

        function showSection(sectionId) {
            console.log('Showing section:', sectionId);
            
            // Hide all sections
            sections.forEach(section => {
                section.classList.remove('active');
            });
            
            // Show target section
            const targetSection = document.getElementById(sectionId);
            if (targetSection) {
                targetSection.classList.add('active');
                currentSection = sectionId;
                console.log('Section shown:', sectionId);
                
                // Update navigation
                updateActiveNavLink(sectionId);
            } else {
                console.error('Section not found:', sectionId);
            }
        }

        function showSectionWithAnimation(sectionId) {
            console.log('Showing section with animation:', sectionId);
            
            // Hide all sections
            sections.forEach(section => {
                section.classList.remove('active');
            });
            
            // Show target section with animation
            const targetSection = document.getElementById(sectionId);
            if (targetSection) {
                targetSection.classList.add('active');
                targetSection.style.transform = 'translateY(30px)';
                targetSection.style.opacity = '0';
                
                // Trigger reflow
                targetSection.offsetHeight;
                
                // Animate in
                requestAnimationFrame(() => {
                    targetSection.style.transform = 'translateY(0)';
                    targetSection.style.opacity = '1';
                });
                
                currentSection = sectionId;
                console.log('Section shown with animation:', sectionId);
            } else {
                console.error('Section not found:', sectionId);
            }
        }

        function updateActiveNavLink(sectionId) {
            navLinks.forEach(link => {
                const underline = link.querySelector('.nav__link-underline');
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                    if (underline && !prefersReducedMotion) {
                        underline.style.transform = 'scaleX(1)';
                        underline.style.transformOrigin = 'left';
                    }
                } else if (underline && !prefersReducedMotion) {
                    underline.style.transform = 'scaleX(0)';
                }
            });
        }

        // Enhanced theme toggle with smooth animations
        function setupThemeToggle() {
            console.log('Setting up enhanced theme toggle...');
            
            if (themeToggle) {
                themeToggle.addEventListener('click', function(e) {
                    console.log('Theme toggle clicked');
                    
                    // Add click animation
                    animateThemeToggle();
                    
                    setTimeout(() => {
                        toggleTheme();
                    }, 150);
                });
            } else {
                console.error('Theme toggle button not found');
            }
        }

        function animateThemeToggle() {
            if (prefersReducedMotion) return;
            
            const inner = themeToggle.querySelector('.theme-toggle-inner');
            if (inner) {
                inner.style.transform = 'scale(0.8) rotate(180deg)';
                setTimeout(() => {
                    inner.style.transform = 'scale(1) rotate(360deg)';
                }, 150);
                setTimeout(() => {
                    inner.style.transform = 'scale(1) rotate(0deg)';
                }, 300);
            }
        }

        function toggleTheme() {
            const currentTheme = document.body.dataset.theme || 'dark';
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            console.log('Toggling theme from', currentTheme, 'to', newTheme);
            setTheme(newTheme, true);
        }

        function setTheme(theme, animate = false) {
            console.log('Setting theme to:', theme);
            
            if (animate && !prefersReducedMotion) {
                // Add smooth theme transition
                document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
                setTimeout(() => {
                    document.body.style.transition = '';
                }, 300);
            }
            
            document.body.dataset.theme = theme;
            localStorage.setItem('theme', theme);
            
            // Update theme toggle button accessibility
            const isDark = theme === 'dark';
            if (themeToggle) {
                themeToggle.setAttribute('aria-label', `Switch to ${isDark ? 'light' : 'dark'} theme`);
            }
        }

        // Enhanced mobile menu with slide animations
        function setupMobileMenu() {
            if (navToggle) {
                navToggle.addEventListener('click', toggleMobileMenu);
            }

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (navMenu && !navMenu.contains(e.target) && navToggle && !navToggle.contains(e.target)) {
                    closeMobileMenu();
                }
            });

            // Close menu on escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && navMenu && navMenu.classList.contains('active')) {
                    closeMobileMenu();
                }
            });
        }

        function toggleMobileMenu() {
            if (!navMenu) return;
            
            const isOpen = navMenu.classList.contains('active');
            if (isOpen) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        }

        function openMobileMenu() {
            if (!navMenu) return;
            
            navMenu.classList.add('active');
            updateNavToggle(true);
            
            // Animate menu items
            const menuItems = navMenu.querySelectorAll('.nav__item');
            menuItems.forEach((item, index) => {
                if (!prefersReducedMotion) {
                    item.style.transform = 'translateX(-20px)';
                    item.style.opacity = '0';
                    setTimeout(() => {
                        item.style.transform = 'translateX(0)';
                        item.style.opacity = '1';
                    }, index * 50);
                }
            });
        }

        function closeMobileMenu() {
            if (!navMenu) return;
            
            navMenu.classList.remove('active');
            updateNavToggle(false);
        }

        function updateNavToggle(isOpen) {
            if (navToggle) {
                navToggle.setAttribute('aria-expanded', isOpen.toString());
                const hamburgers = navToggle.querySelectorAll('.nav__hamburger');
                hamburgers.forEach((line, index) => {
                    if (!prefersReducedMotion) {
                        if (isOpen) {
                            if (index === 0) line.style.transform = 'rotate(45deg) translate(5px, 5px)';
                            if (index === 1) line.style.opacity = '0';
                            if (index === 2) line.style.transform = 'rotate(-45deg) translate(7px, -6px)';
                        } else {
                            line.style.transform = '';
                            line.style.opacity = '1';
                        }
                    }
                });
            }
        }

        // Advanced scroll animations with Intersection Observer
        function setupScrollAnimations() {
            if (!window.IntersectionObserver) {
                console.warn('IntersectionObserver not supported');
                // Fallback: show all elements
                const animatableElements = document.querySelectorAll('.animate-on-scroll');
                animatableElements.forEach(el => {
                    el.classList.add('visible');
                });
                return;
            }

            const observerOptions = {
                root: null,
                rootMargin: '-10% 0px -10% 0px',
                threshold: [0, 0.25, 0.5, 0.75, 1]
            };

            intersectionObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        animateElement(entry.target);
                        intersectionObserver.unobserve(entry.target);
                    }
                });
            }, observerOptions);

            // Observe all animatable elements
            const animatableElements = document.querySelectorAll('.animate-on-scroll');
            animatableElements.forEach(el => {
                intersectionObserver.observe(el);
            });
        }

        function animateElement(element) {
            if (!prefersReducedMotion) {
                element.classList.add('visible');
                
                // Add staggered animation for child elements
                const children = element.querySelectorAll('.animate-on-scroll');
                children.forEach((child, index) => {
                    setTimeout(() => {
                        child.classList.add('visible');
                    }, index * 100);
                });
            } else {
                element.classList.add('visible');
            }
        }

        function triggerSectionAnimations(sectionId) {
            const section = document.getElementById(sectionId);
            if (!section) return;

            // Animate elements in the current section
            const animatableElements = section.querySelectorAll('.animate-on-scroll:not(.visible)');
            animatableElements.forEach((el, index) => {
                setTimeout(() => {
                    animateElement(el);
                }, index * 100);
            });

            // Section-specific animations
            switch(sectionId) {
                case 'home':
                    startInitialAnimations();
                    break;
                case 'about':
                    setTimeout(() => {
                        if (!skillsAnimated) {
                            animateSkills();
                            skillsAnimated = true;
                        }
                    }, 600);
                    break;
                case 'projects':
                    setTimeout(() => {
                        if (!timelineAnimated) {
                            animateTimeline();
                            timelineAnimated = true;
                        }
                    }, 400);
                    break;
                case 'education':
                    setTimeout(() => {
                        animateEducationTimeline();
                    }, 400);
                    break;
            }
        }

        function startInitialAnimations() {
            // Animate hero elements
            const heroElements = document.querySelectorAll('#home .animate-fade-up');
            heroElements.forEach((el, index) => {
                if (!prefersReducedMotion) {
                    setTimeout(() => {
                        el.classList.add('visible');
                    }, index * 200);
                } else {
                    el.classList.add('visible');
                }
            });
        }

        // Typewriter effect for hero title
        function setupTypewriterEffect() {
            if (!typewriterElement || prefersReducedMotion) {
                if (typewriterElement) {
                    typewriterElement.classList.add('typing-complete');
                }
                return;
            }

            const text = typewriterElement.dataset.text || typewriterElement.textContent;
            typewriterElement.textContent = '';
            
            setTimeout(() => {
                typewriterAnimation(typewriterElement, text, 0);
            }, 800);
        }

        function typewriterAnimation(element, text, index) {
            if (index < text.length) {
                element.textContent += text[index];
                setTimeout(() => {
                    typewriterAnimation(element, text, index + 1);
                }, ANIMATION_CONFIG.duration.typewriter);
            } else {
                // Remove cursor after typing is complete
                setTimeout(() => {
                    element.classList.add('typing-complete');
                }, 1000);
            }
        }

        // Enhanced skills animation with progressive loading
        function setupSkillsAnimation() {
            const skillBars = document.querySelectorAll('.skill__progress');
            skillBars.forEach(bar => {
                bar.style.width = '0%';
            });
        }

        function animateSkills() {
            const skillBars = document.querySelectorAll('.skill__progress');
            const skillPercentages = document.querySelectorAll('.skill__percentage');
            
            skillBars.forEach((bar, index) => {
                const progress = bar.dataset.progress || 0;
                const percentage = skillPercentages[index];
                
                setTimeout(() => {
                    // Animate skill bar
                    bar.style.width = `${progress}%`;
                    bar.classList.add('animated');
                    
                    // Animate percentage counter
                    if (percentage && !prefersReducedMotion) {
                        animateCounter(percentage, 0, parseInt(progress), 1000);
                        percentage.classList.add('visible');
                    } else if (percentage) {
                        percentage.textContent = `${progress}%`;
                        percentage.classList.add('visible');
                    }
                }, index * 200);
            });
        }

        function animateCounter(element, start, end, duration) {
            if (prefersReducedMotion) {
                element.textContent = `${end}%`;
                return;
            }

            const startTime = performance.now();
            
            function updateCounter(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const easeOutQuart = 1 - Math.pow(1 - progress, 4);
                const current = Math.round(start + (end - start) * easeOutQuart);
                
                element.textContent = `${current}%`;
                
                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                }
            }
            
            requestAnimationFrame(updateCounter);
        }

        // Enhanced timeline animations
        function animateTimeline() {
            const timelineItems = document.querySelectorAll('#projects .timeline__item');
            const timelineLine = document.querySelector('#projects .timeline__line');
            
            // Animate connecting line first
            if (timelineLine && !prefersReducedMotion) {
                timelineLine.classList.add('visible');
            }
            
            // Animate timeline items with stagger
            timelineItems.forEach((item, index) => {
                setTimeout(() => {
                    const marker = item.querySelector('.timeline__marker');
                    const content = item.querySelector('.timeline__content');
                    const techTags = item.querySelectorAll('.tech-tag');
                    
                    // Animate marker
                    if (marker && !prefersReducedMotion) {
                        marker.style.transform = 'scale(1.1)';
                        setTimeout(() => {
                            marker.style.transform = 'scale(1)';
                        }, 200);
                    }
                    
                    // Animate content
                    if (content) {
                        content.style.opacity = '1';
                        content.style.transform = 'translateY(0)';
                    }
                    
                    // Animate tech tags
                    techTags.forEach((tag, tagIndex) => {
                        setTimeout(() => {
                            tag.classList.add('visible');
                        }, tagIndex * 100);
                    });
                }, index * 300);
            });
        }

        function animateEducationTimeline() {
            const timelineItems = document.querySelectorAll('#education .timeline__item');
            const timelineLine = document.querySelector('#education .timeline__line--vertical');
            
            // Animate vertical line
            if (timelineLine && !prefersReducedMotion) {
                timelineLine.classList.add('visible');
            }
            
            // Animate education items
            timelineItems.forEach((item, index) => {
                setTimeout(() => {
                    const marker = item.querySelector('.timeline__marker');
                    const status = item.querySelector('.education__status');
                    
                    if (marker && !prefersReducedMotion) {
                        marker.style.transform = 'scale(1.1)';
                        setTimeout(() => {
                            marker.style.transform = 'scale(1)';
                        }, 200);
                    }
                    
                    if (status) {
                        status.classList.add('visible');
                    }
                }, index * 400);
            });
        }

        // Ripple effects for buttons
        function setupRippleEffects() {
            if (prefersReducedMotion) return;

            const rippleButtons = document.querySelectorAll('.btn--animated');
            
            rippleButtons.forEach(button => {
                button.addEventListener('click', function(e) {
                    const ripple = this.querySelector('.btn__ripple');
                    if (ripple) {
                        const rect = this.getBoundingClientRect();
                        const size = Math.max(rect.width, rect.height);
                        const x = e.clientX - rect.left - size / 2;
                        const y = e.clientY - rect.top - size / 2;
                        
                        ripple.style.width = ripple.style.height = size + 'px';
                        ripple.style.left = x + 'px';
                        ripple.style.top = y + 'px';
                        ripple.style.opacity = '1';
                        
                        setTimeout(() => {
                            ripple.style.opacity = '0';
                        }, 600);
                    }
                });
            });
        }

        // Enhanced button click animations
        function animateButtonClick(button) {
            if (prefersReducedMotion) return;
            
            button.style.transform = 'scale(0.95)';
            setTimeout(() => {
                button.style.transform = 'scale(1)';
            }, 150);
        }

        function animateNavLinkClick(link) {
            if (prefersReducedMotion) return;
            
            const span = link.querySelector('span');
            if (span) {
                span.style.transform = 'translateY(-4px)';
                setTimeout(() => {
                    span.style.transform = 'translateY(0)';
                }, 200);
            }
        }

        // Enhanced contact form with better animations
        function setupContactForm() {
            if (!contactForm) return;

            contactForm.addEventListener('submit', handleFormSubmit);
            
            // Enhanced real-time validation with animations
            const inputs = contactForm.querySelectorAll('.form__input, .form__textarea');
            inputs.forEach(input => {
                input.addEventListener('blur', () => validateField(input));
                input.addEventListener('input', () => clearFieldError(input));
                input.addEventListener('focus', () => animateFieldFocus(input));
            });
        }

        function animateFieldFocus(input) {
            if (prefersReducedMotion) return;
            
            const label = input.previousElementSibling;
            if (label && label.classList.contains('form__label')) {
                label.style.transform = 'translateY(-2px)';
                label.style.color = 'var(--text-primary)';
            }
        }

        function handleFormSubmit(e) {
            e.preventDefault();
            
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);
            
            // Validate form with enhanced animations
            if (!validateForm(data)) {
                return;
            }

            // Show enhanced loading state
            setFormLoading(true);

            // Simulate form submission
            simulateFormSubmission(data)
                .then(() => {
                    showFormStatus('success', 'Message sent successfully! I\'ll get back to you soon.');
                    contactForm.reset();
                    celebrateSuccess();
                })
                .catch(() => {
                    showFormStatus('error', 'Failed to send message. Please try again or contact me directly.');
                })
                .finally(() => {
                    setFormLoading(false);
                });
        }

        function validateForm(data) {
            let isValid = true;
            const fields = ['name', 'email', 'subject', 'message'];

            fields.forEach(field => {
                const input = document.getElementById(field);
                if (input && !validateField(input)) {
                    isValid = false;
                }
            });

            return isValid;
        }

        function validateField(input) {
            const value = input.value.trim();
            const fieldName = input.name;
            let isValid = true;
            let errorMessage = '';

            // Clear previous error
            clearFieldError(input);

            // Validation logic
            if (!value) {
                errorMessage = `${getFieldDisplayName(fieldName)} is required.`;
                isValid = false;
            } else if (fieldName === 'email') {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    errorMessage = 'Please enter a valid email address.';
                    isValid = false;
                }
            } else if (fieldName === 'name' && value.length < 2) {
                errorMessage = 'Name must be at least 2 characters long.';
                isValid = false;
            } else if (fieldName === 'subject' && value.length < 3) {
                errorMessage = 'Subject must be at least 3 characters long.';
                isValid = false;
            } else if (fieldName === 'message' && value.length < 10) {
                errorMessage = 'Message must be at least 10 characters long.';
                isValid = false;
            }

            if (!isValid) {
                showFieldError(input, errorMessage);
            }

            return isValid;
        }

        function showFieldError(input, message) {
            const errorElement = document.getElementById(`${input.name}-error`);
            if (errorElement) {
                errorElement.textContent = message;
                errorElement.classList.add('show');
            }
            input.classList.add('error');
        }

        function clearFieldError(input) {
            const errorElement = document.getElementById(`${input.name}-error`);
            if (errorElement) {
                errorElement.textContent = '';
                errorElement.classList.remove('show');
            }
            input.classList.remove('error');
        }

        function getFieldDisplayName(fieldName) {
            const displayNames = {
                name: 'Name',
                email: 'Email',
                subject: 'Subject',
                message: 'Message'
            };
            return displayNames[fieldName] || fieldName;
        }

        function setFormLoading(loading) {
            const submitBtn = document.getElementById('submitBtn');
            if (submitBtn) {
                if (loading) {
                    submitBtn.classList.add('btn--loading');
                    submitBtn.disabled = true;
                } else {
                    submitBtn.classList.remove('btn--loading');
                    submitBtn.disabled = false;
                }
            }
        }

        function showFormStatus(type, message) {
            const statusElement = document.getElementById('formStatus');
            if (statusElement) {
                statusElement.className = `form__status ${type} show`;
                statusElement.textContent = message;
                
                // Hide after 5 seconds
                setTimeout(() => {
                    statusElement.classList.remove('show');
                }, 5000);
            }
        }

        function celebrateSuccess() {
            if (prefersReducedMotion) return;
            
            // Create celebration particles
            createCelebrationParticles();
        }

        function createCelebrationParticles() {
            const colors = ['var(--text-primary)', 'var(--text-secondary)', 'var(--accent)'];
            
            for (let i = 0; i < 12; i++) {
                const particle = document.createElement('div');
                particle.style.cssText = `
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    width: 8px;
                    height: 8px;
                    background: ${colors[i % colors.length]};
                    border-radius: 50%;
                    pointer-events: none;
                    z-index: 9999;
                    animation: celebrate 1s ease-out forwards;
                    transform: translate(-50%, -50%);
                `;
                
                const angle = (i * 30) * Math.PI / 180;
                const velocity = 100 + Math.random() * 50;
                
                particle.style.setProperty('--dx', Math.cos(angle) * velocity + 'px');
                particle.style.setProperty('--dy', Math.sin(angle) * velocity + 'px');
                
                document.body.appendChild(particle);
                
                setTimeout(() => {
                    particle.remove();
                }, 1000);
            }
        }

        function simulateFormSubmission(data) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    if (Math.random() > 0.1) {
                        console.log('Form submission data:', data);
                        resolve();
                    } else {
                        reject(new Error('Simulated network error'));
                    }
                }, 1500);
            });
        }

        // Enhanced keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                return;
            }

            const sectionIds = ['home', 'about', 'projects', 'education', 'contact'];
            const currentIndex = sectionIds.indexOf(currentSection);

            switch(e.key) {
                case 'ArrowRight':
                case 'ArrowDown':
                    e.preventDefault();
                    if (currentIndex < sectionIds.length - 1) {
                        navigateToSection(sectionIds[currentIndex + 1]);
                    }
                    break;
                case 'ArrowLeft':
                case 'ArrowUp':
                    e.preventDefault();
                    if (currentIndex > 0) {
                        navigateToSection(sectionIds[currentIndex - 1]);
                    }
                    break;
                case 'Home':
                    e.preventDefault();
                    navigateToSection('home');
                    break;
                case 'End':
                    e.preventDefault();
                    navigateToSection('contact');
                    break;
            }
        });

        // Cleanup on page unload
        window.addEventListener('beforeunload', () => {
            if (intersectionObserver) {
                intersectionObserver.disconnect();
            }
        });

        // Add celebration keyframes to document
        if (!prefersReducedMotion) {
            const style = document.createElement('style');
            style.textContent = `
                @keyframes celebrate {
                    0% {
                        transform: translate(-50%, -50%) scale(1);
                        opacity: 1;
                    }
                    100% {
                        transform: translate(calc(-50% + var(--dx)), calc(-50% + var(--dy))) scale(0);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }

        // Export enhanced API for testing
        window.Portfolio = {
            navigateToSection,
            setTheme,
            toggleTheme,
            getCurrentSection: () => currentSection,
            showSection: showSectionWithAnimation,
            animateSkills,
            isAnimating: () => isAnimating
        };
    });

})();