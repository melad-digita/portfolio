// --- 1. Global Variables & Initialization ---
const htmlElement = document.documentElement;
const themeToggleButton = document.getElementById('themeToggle');
const themeToggleMobile = document.getElementById('themeToggleMobile');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const navbar = document.querySelector('.navbar-custom');

// Initialize Lucide Icons
if (typeof lucide !== 'undefined') {
    lucide.createIcons();
}

// Initialize Theme
const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
htmlElement.setAttribute('data-theme', savedTheme);

// --- 2. Theme Toggle ---
function toggleTheme() {
    const currentTheme = htmlElement.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    htmlElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('portfolio-theme', newTheme);

    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    if (mobileMenu && mobileMenu.classList.contains('active')) {
        closeMobileMenu();
    }
}

if (themeToggleButton) themeToggleButton.addEventListener('click', toggleTheme);
if (themeToggleMobile) themeToggleMobile.addEventListener('click', toggleTheme);

// --- 3. Mobile Navigation ---
function closeMobileMenu() {
    if (mobileMenu && mobileMenu.classList.contains('active')) {
        mobileMenu.classList.remove('active');
        const icon = mobileMenuBtn.querySelector('i');
        if (icon) {
            icon.setAttribute('data-lucide', 'menu');
            lucide.createIcons();
        }
    }
}

if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        const icon = mobileMenuBtn.querySelector('i');
        if (mobileMenu.classList.contains('active')) {
            icon.setAttribute('data-lucide', 'x');
        } else {
            icon.setAttribute('data-lucide', 'menu');
        }
        lucide.createIcons();
    });
}

const mobileMenuLinks = document.querySelectorAll('.mobile-menu-link');
mobileMenuLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
});

window.addEventListener('resize', () => {
    if (window.innerWidth >= 768) {
        closeMobileMenu();
    }
});

// --- 4. Smooth Scrolling ---
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const href = this.getAttribute('href');
        if (href === '#') return;

        const target = document.querySelector(href);
        if (target) {
            const navbarHeight = 80;
            const targetPosition = target.offsetTop - (navbarHeight / 2);

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

window.addEventListener('scroll', () => {
    if (navbar) {
        navbar.classList.toggle('nav-scrolled', window.scrollY > 50);
    }
});

// --- 5. Typing Animations ---
// Hero Typing
const typingText = document.getElementById('typingText');
const textToType = 'Melad Atef';
let charIndex = 0;

function typeHeroText() {
    if (typingText && charIndex < textToType.length) {
        typingText.textContent += textToType.charAt(charIndex);
        charIndex++;
        setTimeout(typeHeroText, 150);
    }
}

// About Typing
function typeHTML(element, html, speed) {
    let i = 0;
    function type() {
        if (i < html.length) {
            if (html[i] === '<') {
                i = html.indexOf('>', i) + 1;
            } else {
                i++;
            }
            element.innerHTML = html.substring(0, i);
            setTimeout(type, speed);
        }
    }
    type();
}

const aboutTypingTarget = document.getElementById('aboutTypingTarget');
let aboutTyped = false;
let originalAboutHTML = '';

if (aboutTypingTarget) {
    originalAboutHTML = aboutTypingTarget.innerHTML;
    aboutTypingTarget.innerHTML = '';
}

window.addEventListener('load', () => {
    if (typingText) {
        setTimeout(typeHeroText, 500);
    }
});

// --- 6. Scroll Animations (Observer) ---
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('section, .project-card, .skill-card, .video-card, .stat-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);

    if (el.id === 'about') {
        const aboutObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !aboutTyped && aboutTypingTarget) {
                    aboutTyped = true;
                    setTimeout(() => typeHTML(aboutTypingTarget, originalAboutHTML, 25), 300);
                }
            });
        }, { threshold: 0.4 });
        aboutObserver.observe(el);
    }
});

// Interaction effects
document.querySelectorAll('button, a').forEach(element => {
    element.addEventListener('mouseenter', function () {
        this.style.transform = 'translateY(-2px)';
    });
    element.addEventListener('mouseleave', function () {
        this.style.transform = 'translateY(0)';
    });
});

// --- 7. Contact Form Handling ---
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');
const submitBtn = document.getElementById('submitBtn');
const submitText = document.getElementById('submitText');

if (contactForm) {
    contactForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        if (!submitBtn || !submitText) return;

        submitBtn.disabled = true;
        submitText.textContent = 'Sending...';

        try {
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: new FormData(contactForm),
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                formStatus.style.display = 'block';
                formStatus.style.color = '#10b981';
                formStatus.textContent = 'Message sent successfully ✔';
                contactForm.reset();
                setTimeout(() => { formStatus.style.display = 'none'; }, 5000);
            } else {
                const data = await response.json();
                formStatus.style.display = 'block';
                formStatus.style.color = '#ef4444';
                formStatus.textContent = data.error || 'Oops! There was a problem submitting your form.';
            }
        } catch (error) {
            formStatus.style.display = 'block';
            formStatus.style.color = '#ef4444';
            formStatus.textContent = 'Network error. Please try again.';
        } finally {
            submitBtn.disabled = false;
            submitText.textContent = 'Send Message';
        }
    });
}

// --- 8. Space Background Animation ---
const canvas = document.getElementById('space-background');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height, stars = [], meteors = [];

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
        createStars();
    }

    function createStars() {
        stars = [];
        const starCount = Math.floor((width * height) / 3000);
        for (let i = 0; i < starCount; i++) {
            stars.push({
                x: Math.random() * width,
                y: Math.random() * height,
                size: Math.random() * 1.5,
                opacity: Math.random(),
                speed: Math.random() * 0.05
            });
        }
    }

    function createMeteor() {
        meteors.push({
            x: Math.random() * width,
            y: -50,
            size: Math.random() * 2 + 1,
            speed: Math.random() * 5 + 5,
            length: Math.random() * 80 + 20,
            angle: Math.PI / 4 + (Math.random() * 0.2 - 0.1)
        });
    }

    function animateSpace() {
        ctx.clearRect(0, 0, width, height);

        // Draw Stars
        ctx.fillStyle = 'white';
        stars.forEach(star => {
            ctx.globalAlpha = star.opacity;
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            ctx.fill();
            star.opacity += (Math.random() - 0.5) * 0.02;
            if (star.opacity < 0.1) star.opacity = 0.1;
            if (star.opacity > 1) star.opacity = 1;
        });

        // Draw Meteors
        meteors.forEach((meteor, index) => {
            ctx.globalAlpha = 1;
            const endX = meteor.x - meteor.length * Math.cos(meteor.angle);
            const endY = meteor.y - meteor.length * Math.sin(meteor.angle);
            const gradient = ctx.createLinearGradient(meteor.x, meteor.y, endX, endY);
            gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
            ctx.strokeStyle = gradient;
            ctx.lineWidth = meteor.size;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(meteor.x, meteor.y);
            ctx.lineTo(endX, endY);
            ctx.stroke();
            meteor.x += meteor.speed * Math.cos(meteor.angle);
            meteor.y += meteor.speed * Math.sin(meteor.angle);
            if (meteor.y > height + 100 || meteor.x > width + 100) {
                meteors.splice(index, 1);
            }
        });

        if (Math.random() < 0.02) createMeteor();
        requestAnimationFrame(animateSpace);
    }

    window.addEventListener('resize', resize);
    resize();
    animateSpace();
}

console.log('Portfolio loaded successfully! 🚀');
