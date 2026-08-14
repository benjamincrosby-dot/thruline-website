// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', function() {
            navLinks.classList.toggle('active');

            // Animate hamburger to X
            const spans = mobileMenuBtn.querySelectorAll('span');
            spans.forEach((span, index) => {
                if (navLinks.classList.contains('active')) {
                    if (index === 0) {
                        span.style.transform = 'rotate(45deg) translate(5px, 5px)';
                    } else if (index === 1) {
                        span.style.opacity = '0';
                    } else if (index === 2) {
                        span.style.transform = 'rotate(-45deg) translate(6px, -6px)';
                    }
                } else {
                    span.style.transform = 'none';
                    span.style.opacity = '1';
                }
            });
        });

        // Close menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                const spans = mobileMenuBtn.querySelectorAll('span');
                spans.forEach(span => {
                    span.style.transform = 'none';
                    span.style.opacity = '1';
                });
            });
        });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
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

    // Copy-link buttons on blog post titles
    const linkIconSVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>';

    document.querySelectorAll('.blog-post[id]').forEach(post => {
        const heading = post.querySelector('h2');
        if (!heading) return;

        const anchor = post.id;
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'copy-link-btn';
        btn.setAttribute('aria-label', 'Copy link to this post');
        btn.title = 'Copy link to this post';
        btn.innerHTML = linkIconSVG;

        let resetTimer;
        btn.addEventListener('click', async () => {
            const url = `${location.origin}${location.pathname}#${anchor}`;

            try {
                await navigator.clipboard.writeText(url);
            } catch (err) {
                // Fallback for older browsers or non-secure (file://) contexts
                const tmp = document.createElement('textarea');
                tmp.value = url;
                tmp.style.position = 'fixed';
                tmp.style.opacity = '0';
                document.body.appendChild(tmp);
                tmp.select();
                try { document.execCommand('copy'); } catch (e) {}
                document.body.removeChild(tmp);
            }

            btn.classList.add('copied');
            clearTimeout(resetTimer);
            resetTimer = setTimeout(() => btn.classList.remove('copied'), 2000);
        });

        heading.appendChild(btn);
    });

    // Form submission handling
    const contactForm = document.getElementById('contact-form');
    const formSuccess = document.getElementById('form-success');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form data
            const formData = new FormData(contactForm);
            const data = {};
            formData.forEach((value, key) => {
                data[key] = value;
            });

            // Log form data (in production, this would be sent to a server)
            console.log('Form submitted:', data);

            // Show success message
            formSuccess.hidden = false;

            // Reset form
            contactForm.reset();

            // Scroll to success message
            formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });

            // Hide success message after 5 seconds
            setTimeout(() => {
                formSuccess.hidden = true;
            }, 5000);
        });
    }

    // Header scroll effect
    const header = document.querySelector('.header');
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;

        if (currentScrollY > 100) {
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.boxShadow = 'none';
        }

        lastScrollY = currentScrollY;
    });

    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.value-card, .service-card, .about-content, .get-started-content, .get-started-form');

    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Active nav link highlighting based on scroll position
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-links a');
    const navSectionIds = ['home', 'about', 'services', 'get-started'];

    function highlightNav() {
        const scrollY = window.scrollY;
        let currentSection = 'home';

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            const sectionId = section.getAttribute('id');

            // Only update if this section is in the nav
            if (scrollY >= sectionTop && navSectionIds.includes(sectionId)) {
                currentSection = sectionId;
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            const href = item.getAttribute('href');
            if (href === `#${currentSection}`) {
                item.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', highlightNav);
    highlightNav(); // Initial call
});
