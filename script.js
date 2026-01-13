// Global Variables
let slideshowInterval;
const totalSlides = 6; // Placeholder count
let currentSlide = 0;
const audio = document.getElementById('bg-music');

document.addEventListener('DOMContentLoaded', () => {
    // Custom Cursor Logic
    const cursorDot = document.querySelector('[data-cursor-dot]');
    const cursorOutline = document.querySelector('[data-cursor-outline]');

    if (window.matchMedia("(pointer: fine)").matches) { // Only on desktops
        window.addEventListener("mousemove", function (e) {
            const posX = e.clientX;
            const posY = e.clientY;

            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;

            // Simple lag effect for the outline
            cursorOutline.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { duration: 500, fill: "forwards" });
        });
    }

    // Confetti Init
    // (Will trigger on 'Enter' not load to save resources)

    // Floating Hearts
    initHearts();

    // Intersection Observer
    initObserver();

    // Theme Check
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
        updateThemeIcon(savedTheme);
    }

    // Slideshow Start
    startSlideshow();
});

// --- Welcome / Enter Functions ---
function enterSite() {
    const overlay = document.getElementById('welcome-overlay');
    overlay.style.opacity = '0';
    overlay.style.transform = 'translateY(100%)';
    setTimeout(() => {
        overlay.style.display = 'none';
    }, 1000);

    // Play Music
    const audio = document.getElementById('bg-music');
    if (audio) {
        audio.volume = 0.5; // Start at 50% volume
        audio.play().catch(error => {
            console.log("Audio play failed (browser policy):", error);
        });
        updateMusicIcon(true);
    }

    // Trigger Confetti
    triggerConfetti();
}

// --- Slideshow Functions ---
function startSlideshow() {
    const slides = document.querySelectorAll('.slide');
    if (slides.length === 0) return;

    setInterval(() => {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }, 4000); // Change every 4 seconds
}

// --- Particle/Animation Functions ---
function initHearts() {
    const container = document.getElementById('hearts-container');
    const symbols = ['❤', '♥', '♡', '✨'];

    setInterval(() => {
        const heart = document.createElement('div');
        heart.classList.add('heart');
        heart.innerText = symbols[Math.floor(Math.random() * symbols.length)];
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.animationDuration = (Math.random() * 5 + 5) + 's';
        heart.style.fontSize = (Math.random() * 20 + 10) + 'px';
        container.appendChild(heart);
        setTimeout(() => heart.remove(), 10000);
    }, 500);
}

function initObserver() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.classList.contains('reveal-hidden')) {
                    entry.target.classList.remove('reveal-hidden');
                    entry.target.classList.add('reveal-visible');
                }
                if (entry.target.classList.contains('slide-down-hidden')) {
                    entry.target.classList.remove('slide-down-hidden');
                    entry.target.classList.add('slide-down-visible');
                }
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    // Gallery Items (Staggered)
    document.querySelectorAll('.gallery-grid').forEach(grid => {
        const items = grid.querySelectorAll('.gallery-item');
        items.forEach((item, index) => {
            item.style.opacity = '';
            item.classList.add('reveal-hidden');
            // Stagger by 150ms, resetting every 3 items for a wave effect per row
            item.style.transitionDelay = `${(index % 3) * 0.15}s`;
            observer.observe(item);
        });
    });

    // Section Titles
    document.querySelectorAll('.section-title').forEach(title => {
        observer.observe(title);
    });

    // Quote Box
    const quoteBox = document.querySelector('.quote-box');
    if (quoteBox) {
        observer.observe(quoteBox);
    }
}

function triggerConfetti() {
    const count = 200;
    const defaults = {
        origin: { y: 0.7 }
    };

    function fire(particleRatio, opts) {
        confetti(Object.assign({}, defaults, opts, {
            particleCount: Math.floor(count * particleRatio)
        }));
    }

    fire(0.25, { spread: 26, startVelocity: 55 });
    fire(0.2, { spread: 60 });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    fire(0.1, { spread: 120, startVelocity: 45 });
}

// --- UI Controls ---
function toggleMusic() {
    const audio = document.getElementById('bg-music');
    if (audio.paused) {
        audio.play();
        updateMusicIcon(true);
    } else {
        audio.pause();
        updateMusicIcon(false);
    }
}

function updateMusicIcon(isPlaying) {
    const icon = document.getElementById('music-icon');
    icon.className = isPlaying ? 'fas fa-pause' : 'fas fa-play';
}

function toggleTheme() {
    const newTheme = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
    const icon = document.getElementById('theme-icon');
    icon.className = theme === 'light' ? 'fas fa-sun' : 'fas fa-moon';
}

// --- Modal ---
function openModal() {
    const modal = document.getElementById('noteModal');
    modal.style.display = 'flex';
    // Small delay to allow display:flex to apply before adding class for transition
    setTimeout(() => modal.classList.add('show'), 10);
}

function closeModal() {
    const modal = document.getElementById('noteModal');
    modal.classList.remove('show');
    setTimeout(() => modal.style.display = 'none', 400);
}

window.onclick = function (event) {
    const modal = document.getElementById('noteModal');
    if (event.target == modal) {
        closeModal();
    }
}

function scrollToGallery() {
    document.getElementById('gallery').scrollIntoView({ behavior: 'smooth' });
}

function scrollToExperience() {
    document.getElementById('experience').scrollIntoView({ behavior: 'smooth' });
}
