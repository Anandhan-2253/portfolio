document.addEventListener('DOMContentLoaded', () => {

    // --- Safety Reveal ---
    const revealSite = () => {
        document.body.classList.remove('loading');
        document.querySelectorAll('.reveal').forEach(el => el.classList.add('active'));
        if (typeof gsap !== 'undefined') {
            gsap.to(".header", { y: 0, opacity: 1, duration: 1, ease: "power4.out" });
        }
    };
    setTimeout(revealSite, 4000); // Fail-safe: Reveal after 4s anyway

    // --- Library Check ---
    if (typeof gsap === 'undefined' || typeof THREE === 'undefined') {
        console.warn("External libraries failing to load. Checking CSP/Internet.");
        revealSite();
        return;
    }

    gsap.registerPlugin(ScrollTrigger);

    // --- Scroll Progress Bar ---
    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        const progressBar = document.querySelector(".scroll-progress");
        if (progressBar) progressBar.style.width = scrolled + "%";
    });

    // --- Custom Cursor ---
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');

    window.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;
        if (cursorDot) {
            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;
        }
        if (cursorOutline) {
            gsap.to(cursorOutline, {
                left: posX,
                top: posY,
                duration: 0.5,
                ease: "power2.out"
            });
        }
    });

    // --- Project Card Cursor Fix ---
    const pCards = document.querySelectorAll('.project-card');
    pCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            if (cursorDot) cursorDot.style.opacity = '0';
            if (cursorOutline) cursorOutline.style.opacity = '0';
        });
        card.addEventListener('mouseleave', () => {
            if (cursorDot) cursorDot.style.opacity = '1';
            if (cursorOutline) cursorOutline.style.opacity = '1';
        });
    });

    // --- Hero Parallax ---
    window.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;
        const xPos = (clientX / window.innerWidth - 0.5) * 40;
        const yPos = (clientY / window.innerHeight - 0.5) * 40;

        gsap.to(".hero-content", { x: xPos * 0.5, y: yPos * 0.5, duration: 1 });
        gsap.to(".cyber-card", { x: -xPos, y: -yPos, duration: 1 });
    });

    // --- Typing Effect ---
    const typingText = document.getElementById('typing-text');
    const roles = ["Cybersecurity Enthusiast", "Full-Stack Web Developer", "Software Engineer", "Problem Solver"];
    let roleIndex = 0, charIndex = 0, isDeleting = false;

    function type() {
        if (!typingText) return;
        const currentRole = roles[roleIndex];
        typingText.textContent = isDeleting ? currentRole.substring(0, charIndex - 1) : currentRole.substring(0, charIndex + 1);
        charIndex = isDeleting ? charIndex - 1 : charIndex + 1;

        let typeSpeed = isDeleting ? 50 : 100;
        if (!isDeleting && charIndex === currentRole.length) {
            isDeleting = true; typeSpeed = 2000;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false; roleIndex = (roleIndex + 1) % roles.length; typeSpeed = 500;
        }
        setTimeout(type, typeSpeed);
    }
    setTimeout(type, 1000);

    // --- Scroll Reveal ---
    gsap.utils.toArray(".reveal").forEach(el => {
        ScrollTrigger.create({
            trigger: el,
            start: "top 95%",
            onEnter: () => el.classList.add('active'),
            onLeaveBack: () => el.classList.remove('active'),
            toggleActions: "play none none none"
        });
    });

    // --- Workshops & Credentials Modal Logic ---
    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('modal-image');
    const modalCaption = document.getElementById('caption');
    const closeBtn = document.querySelector('.modal-close');

    const openModal = (src, title, details = "") => {
        if (!modal || !modalImg) return;
        modal.classList.add('active');
        modalImg.src = src;
        if (modalCaption) modalCaption.innerHTML = `<strong>${title}</strong><br><small>${details}</small>`;
        document.body.style.overflow = 'hidden';
        gsap.fromTo(modalImg, { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" });
    };

    const closeModal = () => {
        if (!modal) return;
        gsap.to(modal, {
            opacity: 0, duration: 0.3, onComplete: () => {
                modal.classList.remove('active');
                modal.style.opacity = 1;
                document.body.style.overflow = 'auto';
            }
        });
    };

    document.querySelectorAll('.cert-card').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            openModal(link.getAttribute('href'), link.querySelector('.cert-title').textContent, link.querySelector('.cert-issuer').textContent);
        });
    });

    document.querySelectorAll('.workshop-card').forEach(card => {
        card.addEventListener('click', () => {
            openModal(card.querySelector('img').src, card.dataset.title, `${card.dataset.organizer} • ${card.dataset.year}`);
        });
    });

    // --- Project Details Modal ---
    const pModal = document.getElementById('project-details-modal');
    if (pModal) {
        document.querySelectorAll('.project-details-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                pModal.classList.add('active');
                document.body.style.overflow = 'hidden';
                gsap.fromTo(pModal.querySelector('.modal-container'),
                    { scale: 0.9, opacity: 0 },
                    { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.2)" }
                );
            });
        });

        const closePModal = () => {
            gsap.to(pModal, {
                opacity: 0, duration: 0.3, onComplete: () => {
                    pModal.classList.remove('active');
                    pModal.style.opacity = 1;
                    document.body.style.overflow = 'auto';
                }
            });
        };

        pModal.querySelector('.modal-close').addEventListener('click', closePModal);
        pModal.addEventListener('click', (e) => { if (e.target === pModal) closePModal(); });
    }

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (modal) modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
    document.addEventListener('keydown', (e) => { if (e.key === "Escape") closeModal(); });

    // --- Mobile Navigation ---
    const hamburger = document.querySelector('.hamburger');
    const nav = document.querySelector('.nav');
    if (hamburger && nav) {
        hamburger.addEventListener('click', () => {
            nav.classList.toggle('nav-active');
            hamburger.classList.toggle('active');
        });
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('nav-active');
                hamburger.classList.remove('active');
            });
        });
    }

    // --- Initial Site Reveal ---
    window.addEventListener('load', revealSite);

});
