// =========================================
// Professional Portfolio JavaScript
// Modern, minimal, executive design
// Optimized for smooth scrolling performance
// =========================================

// =========================================
// Lightweight Three.js Background
// =========================================

let renderer, scene, camera, particles, animationId;

const initThreeBackground = () => {
    if (typeof THREE === 'undefined') {
        console.warn('Three.js not loaded');
        return;
    }

    const container = document.getElementById('canvas-container');
    if (!container) return;

    try {
        // Scene setup
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0x0f1419);

        camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        camera.position.z = 30;

        // Renderer - optimized for performance
        renderer = new THREE.WebGLRenderer({
            antialias: false,
            alpha: true,
            powerPreference: 'high-performance',
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5)); // Cap pixel ratio
        renderer.shadowMap.enabled = false;
        container.appendChild(renderer.domElement);

        // Simplified particle field - fewer particles for better performance
        const particlesGeometry = new THREE.BufferGeometry();
        const particleCount = 80; // Reduced from 150
        const positions = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * 80;
            positions[i + 1] = (Math.random() - 0.5) * 80;
            positions[i + 2] = (Math.random() - 0.5) * 80;
        }

        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        const particlesMaterial = new THREE.PointsMaterial({
            color: 0x3b82f6,
            size: 0.25,
            sizeAttenuation: true,
            transparent: true,
            opacity: 0.3,
        });

        particles = new THREE.Points(particlesGeometry, particlesMaterial);
        scene.add(particles);

        // Simplified sphere - lower geometry complexity
        const sphereGeometry = new THREE.IcosahedronGeometry(18, 3);
        const sphereMaterial = new THREE.MeshPhongMaterial({
            color: 0x1e40af,
            wireframe: true,
            opacity: 0.03,
            transparent: true,
            emissive: 0x3b82f6,
            emissiveIntensity: 0.08,
        });

        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        scene.add(sphere);

        // Minimal lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
        scene.add(ambientLight);

        // Animation loop - no mouse tracking for better performance
        const animate = () => {
            animationId = requestAnimationFrame(animate);

            // Gentle rotation
            particles.rotation.x += 0.00008;
            particles.rotation.y += 0.00012;

            sphere.rotation.x += 0.00008;
            sphere.rotation.y += 0.00012;

            renderer.render(scene, camera);
        };

        animate();

        // Handle window resize
        const handleResize = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;

            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
        };

        window.addEventListener('resize', handleResize);

        // Cleanup function
        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener('resize', handleResize);
            renderer.dispose();
            particlesGeometry.dispose();
            particlesMaterial.dispose();
        };
    } catch (error) {
        console.error('Three.js initialization error:', error);
    }
};

// =========================================
// Scroll Reveal Animations
// =========================================

const initScrollReveal = () => {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        console.warn('GSAP or ScrollTrigger not loaded');
        return;
    }

    gsap.registerPlugin(ScrollTrigger);

    // Section reveals - animate all sections
    const revealElements = document.querySelectorAll('section');
    revealElements.forEach((section, index) => {
        // Skip hero section (has its own animation)
        if (section.id === 'hero') return;
        
        gsap.fromTo(
            section,
            { opacity: 0, y: 40 },
            {
                opacity: 1,
                y: 0,
                duration: 0.8,
                scrollTrigger: {
                    trigger: section,
                    start: 'top 75%',
                    end: 'top 50%',
                    scrub: false,
                    markers: false,
                },
            }
        );
    });

    // Project cards - staggered
    const projectCards = document.querySelectorAll('.project-card');
    if (projectCards.length > 0) {
        gsap.fromTo(
            projectCards,
            { opacity: 0, y: 30 },
            {
                opacity: 1,
                y: 0,
                duration: 0.6,
                stagger: 0.1,
                scrollTrigger: {
                    trigger: '.projects-grid',
                    start: 'top 70%',
                    markers: false,
                },
            }
        );
    }

    // Skills cards
    const skillCards = document.querySelectorAll('.skill-category');
    if (skillCards.length > 0) {
        gsap.fromTo(
            skillCards,
            { opacity: 0, y: 20 },
            {
                opacity: 1,
                y: 0,
                duration: 0.5,
                stagger: 0.08,
                scrollTrigger: {
                    trigger: '.skills-grid',
                    start: 'top 75%',
                    markers: false,
                },
            }
        );
    }

    // Credentials cards
    const credentialCards = document.querySelectorAll('.credential-card');
    if (credentialCards.length > 0) {
        gsap.fromTo(
            credentialCards,
            { opacity: 0, y: 20 },
            {
                opacity: 1,
                y: 0,
                duration: 0.5,
                stagger: 0.08,
                scrollTrigger: {
                    trigger: '.credentials-grid',
                    start: 'top 75%',
                    markers: false,
                },
            }
        );
    }

    // Refresh ScrollTrigger to recalculate all positions
    ScrollTrigger.refresh();
};

// =========================================
// Mobile Navigation
// =========================================

const initMobileNav = () => {
    const hamburger = document.querySelector('.hamburger');
    const nav = document.querySelector('.nav');
    const navLinks = document.querySelectorAll('.nav-link');

    if (!hamburger || !nav) return;

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        nav.classList.toggle('nav-active');
    });

    navLinks.forEach((link) => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            nav.classList.remove('nav-active');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!nav.contains(e.target) && !hamburger.contains(e.target)) {
            hamburger.classList.remove('active');
            nav.classList.remove('nav-active');
        }
    });
};

// =========================================
// Active Navigation Link on Scroll
// =========================================

const initActiveNav = () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    const highlightNavLink = () => {
        let current = '';
        sections.forEach((section) => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.pageYOffset >= sectionTop - 300) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach((link) => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', highlightNavLink);
};

// =========================================
// Initialize Everything
// =========================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Three.js background first
    initThreeBackground();

    // Delay scroll reveal to ensure DOM is ready
    setTimeout(() => {
        initScrollReveal();
    }, 100);

    // Initialize mobile navigation
    initMobileNav();

    // Initialize active navigation highlighting
    initActiveNav();

    // Hero section animations
    if (typeof gsap !== 'undefined') {
        const heroElements = document.querySelectorAll(
            '.hero-subtitle, .hero-title, .hero-tagline, .hero-description, .hero-cta'
        );

        gsap.fromTo(
            heroElements,
            { opacity: 0, y: 25 },
            {
                opacity: 1,
                y: 0,
                duration: 0.7,
                stagger: 0.12,
                ease: 'power2.out',
            }
        );
    }
});

// After page fully loads, refresh ScrollTrigger
window.addEventListener('load', () => {
    // Ensure smooth scrolling is enabled
    if (document.documentElement.style.scrollBehavior === '') {
        document.documentElement.style.scrollBehavior = 'smooth';
    }
    
    // Refresh ScrollTrigger after all images and content load
    if (typeof ScrollTrigger !== 'undefined') {
        setTimeout(() => {
            ScrollTrigger.refresh();
        }, 500);
    }
});

// =========================================
// Smooth scroll to anchor links
// =========================================

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                });
            }
        }
    });
});

// =========================================
// Credential inline preview
// Shows certificate image directly inside the card when clicked.
// =========================================
function setupInlineCredentialPreview() {
    const credentialCards = document.querySelectorAll('.credential-card');

    credentialCards.forEach(card => {
        // ensure card is positioned for absolute child
        card.style.position = 'relative';

        card.addEventListener('click', () => {
            // if preview already exists, remove it (toggle behavior)
            const existing = card.querySelector('.credential-preview');
            if (existing) {
                existing.remove();
                return;
            }

            // remove previews from other cards
            document.querySelectorAll('.credential-preview').forEach(el => el.remove());

            const imgSrc = card.getAttribute('data-img');
            if (!imgSrc) return;

            const preview = document.createElement('div');
            preview.className = 'credential-preview';
            preview.innerHTML = `
                <span class="preview-close" aria-label="Close">&times;</span>
                <img src="${imgSrc}" alt="Certificate Preview" />
            `;

            card.appendChild(preview);

            // close button inside preview
            const closeBtn = preview.querySelector('.preview-close');
            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                preview.remove();
            });
        });

        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                card.click();
            }
        });
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupInlineCredentialPreview);
} else {
    setupInlineCredentialPreview();
}
