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

// ─── View More Projects ──────────────────────────────────────
const viewMoreBtn = document.getElementById('viewMoreBtn');
const viewMoreLabel = document.getElementById('viewMoreLabel');
const viewMoreIcon = document.getElementById('viewMoreIcon');
const extraProjects = document.querySelectorAll('.project-extra');

let projectsExpanded = false;

viewMoreBtn.addEventListener('click', () => {
    projectsExpanded = !projectsExpanded;

    extraProjects.forEach((card, i) => {
        if (projectsExpanded) {
            // Tampilkan dengan animasi fade-in bertahap
            card.classList.remove('hidden');
            card.style.opacity = '0';
            card.style.transform = 'translateY(16px)';
            setTimeout(() => {
                card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, i * 80);
        } else {
            card.classList.add('hidden');
            card.style.opacity = '';
            card.style.transform = '';
            card.style.transition = '';
        }
    });

    viewMoreLabel.textContent = projectsExpanded ? 'Show Less' : 'View More Projects';
    viewMoreIcon.style.transform = projectsExpanded ? 'rotate(180deg)' : 'rotate(0deg)';
});
const themeToggle = document.getElementById('themeToggle');
const iconSun  = document.getElementById('iconSun');
const iconMoon = document.getElementById('iconMoon');
const htmlEl   = document.documentElement;

// Load saved preference (default: dark)
const savedTheme = localStorage.getItem('theme') || 'dark';
applyTheme(savedTheme);

themeToggle.addEventListener('click', () => {
    const isCurrentlyDark = !htmlEl.classList.contains('light');
    applyTheme(isCurrentlyDark ? 'light' : 'dark');
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
