// Mobile menu toggle
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');

mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});

// Close mobile menu when clicking a link
mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
    });
});

// Active nav link on scroll
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

// ─── Dark / Light Mode Toggle ────────────────────────────────
const themeToggle = document.getElementById('themeToggle');
const iconSun  = document.getElementById('iconSun');
const iconMoon = document.getElementById('iconMoon');
const htmlEl   = document.documentElement;

// Load saved preference (default: dark)
const savedTheme = localStorage.getItem('theme') || 'dark';
applyTheme(savedTheme);

themeToggle.addEventListener('click', () => {
    const isDark = htmlEl.classList.contains('light') === false;
    applyTheme(isDark ? 'light' : 'dark');
});

function applyTheme(theme) {
    if (theme === 'light') {
        htmlEl.classList.add('light');
        iconSun.classList.add('hidden');
        iconMoon.classList.remove('hidden');
        localStorage.setItem('theme', 'light');
    } else {
        htmlEl.classList.remove('light');
        iconSun.classList.remove('hidden');
        iconMoon.classList.add('hidden');
        localStorage.setItem('theme', 'dark');
    }
}
