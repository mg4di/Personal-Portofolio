// ─── Mobile Menu Toggle ──────────────────────────────────────
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');

mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});

mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
    });
});

// ─── Active Nav Link on Scroll ───────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        if (window.scrollY >= sectionTop) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active', 'text-white');
        link.classList.add('text-gray-400');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active', 'text-white');
            link.classList.remove('text-gray-400');
        }
    });
});

// ─── AOS Init ────────────────────────────────────────────────
AOS.init({
    duration: 800,
    easing: 'ease-out-cubic',
    once: false,
    offset: 80,
    disable: () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
});

// ─── Dark / Light Mode Toggle + Water Drop Transition ────────
const themeToggle = document.getElementById('themeToggle');
const iconSun  = document.getElementById('iconSun');
const iconMoon = document.getElementById('iconMoon');
const htmlEl   = document.documentElement;

// Load saved preference (default: dark)
const savedTheme = localStorage.getItem('theme') || 'dark';
applyTheme(savedTheme, false);

themeToggle.addEventListener('click', () => {
    const isCurrentlyDark = !htmlEl.classList.contains('light');
    const nextTheme = isCurrentlyDark ? 'light' : 'dark';
    rippleTransition(nextTheme);
});

function rippleTransition(theme) {
    const btn = themeToggle;
    const rect = btn.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    const maxRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
    );

    // Overlay color = destination theme background
    const overlayColor = theme === 'light' ? '#f5f7fa' : '#0a0e17';

    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        inset: 0;
        z-index: 99999;
        background: ${overlayColor};
        clip-path: circle(0px at ${x}px ${y}px);
        pointer-events: none;
        will-change: clip-path;
    `;
    document.body.appendChild(overlay);

    // Phase 1: expand ripple to cover full page (0 → maxRadius)
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            overlay.style.transition = 'clip-path 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            overlay.style.clipPath = `circle(${maxRadius}px at ${x}px ${y}px)`;
        });
    });

    overlay.addEventListener('transitionend', () => {
        // Full page now covered — safe to switch theme, eye sees nothing
        applyTheme(theme, true);

        // Phase 2: shrink ripple from same origin to reveal new theme content
        overlay.style.transition = 'clip-path 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
        overlay.style.clipPath = `circle(0px at ${x}px ${y}px)`;

        overlay.addEventListener('transitionend', () => overlay.remove(), { once: true });
    }, { once: true });
}

function applyTheme(theme, saveToStorage = true) {
    if (theme === 'light') {
        htmlEl.classList.add('light');
        iconSun.classList.add('hidden');
        iconMoon.classList.remove('hidden');
    } else {
        htmlEl.classList.remove('light');
        iconSun.classList.remove('hidden');
        iconMoon.classList.add('hidden');
    }
    if (saveToStorage) localStorage.setItem('theme', theme);
}
