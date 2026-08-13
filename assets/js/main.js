// ─── Mobile Menu Toggle ──────────────────────────────────────
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');

if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
        const isOpen = !mobileMenu.classList.contains('open');
        mobileMenu.classList.toggle('open', isOpen);
        mobileMenuBtn.classList.toggle('open', isOpen);
        mobileMenuBtn.setAttribute('aria-expanded', String(isOpen));
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('open');
            mobileMenuBtn.classList.remove('open');
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
        });
    });
}

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
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
        }
    });
});

// ─── 3D Tilt Card ────────────────────────────────────────────
(function () {
    const card = document.getElementById('tiltCard');
    const glare = document.getElementById('tiltGlare');
    const float = document.getElementById('tiltFloat');
    if (!card) return;

    // Skip on touch / reduced-motion
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    const MAX_TILT = 14;    // degrees
    const GLARE_MAX = 0.28;  // max glare opacity

    let raf = null;
    let targetRX = 0, targetRY = 0;
    let currentRX = 0, currentRY = 0;
    let isHovered = false;

    function lerp(a, b, t) { return a + (b - a) * t; }

    function animate() {
        // Lowered lerp factor to 0.06 for a smoother glide
        currentRX = lerp(currentRX, targetRX, 0.06);
        currentRY = lerp(currentRY, targetRY, 0.06);

        card.style.transform =
            `rotateX(${currentRX}deg) rotateY(${currentRY}deg)`;

        // Floating border parallax — opposite direction, shallower
        if (float) {
            float.style.transform =
                `translateZ(-20px) rotateX(${-currentRX * 0.4}deg) rotateY(${-currentRY * 0.4}deg)`;
        }

        // Glare position based on tilt
        if (glare) {
            const gx = 50 + currentRY * 2;
            const gy = 50 - currentRX * 2;
            const gOpacity = (Math.abs(currentRX) + Math.abs(currentRY)) / (MAX_TILT * 2) * GLARE_MAX;
            glare.style.background =
                `radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,${gOpacity * 1.6}) 0%, transparent 65%)`;
            glare.style.opacity = gOpacity > 0.01 ? '1' : '0';
        }

        if (isHovered ||
            Math.abs(currentRX) > 0.05 ||
            Math.abs(currentRY) > 0.05) {
            raf = requestAnimationFrame(animate);
        } else {
            raf = null;
        }
    }

    function startRaf() {
        if (!raf) raf = requestAnimationFrame(animate);
    }

    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;   // 0–1
        const y = (e.clientY - rect.top) / rect.height;  // 0–1
        targetRY = (x - 0.5) * MAX_TILT * 2;
        targetRX = -(y - 0.5) * MAX_TILT * 2;
        startRaf();
    });

    card.addEventListener('mouseenter', () => {
        isHovered = true;
        card.style.transition = 'none';
        startRaf();
    });

    card.addEventListener('mouseleave', () => {
        isHovered = false;
        targetRX = 0;
        targetRY = 0;
        startRaf();
    });
})();

// ─── AOS Init ────────────────────────────────────────────────
AOS.init({
    duration: 800,
    easing: 'ease-out-cubic',
    once: false,
    offset: 80,
    disable: () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
});

// ─── Dark / Light Mode Toggle (With Symmetric Circular View Transition) ───
const themeToggle = document.getElementById('themeToggle');
const iconSun = document.getElementById('iconSun');
const iconMoon = document.getElementById('iconMoon');
const htmlEl = document.documentElement;

if (themeToggle) {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    applyTheme(savedTheme, false);

    themeToggle.addEventListener('click', (event) => {
        const isCurrentlyDark = htmlEl.getAttribute('data-theme') !== 'light';
        const nextTheme = isCurrentlyDark ? 'light' : 'dark';

        const supportsViewTransitions = 'startViewTransition' in document;
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (!supportsViewTransitions || prefersReducedMotion) {
            applyTheme(nextTheme, true);
            return;
        }

        // Get the exact center of the page
        const x = window.innerWidth / 2;
        const y = window.innerHeight / 2;

        // Calculate maximum radius required to cover the screen
        const endRadius = Math.hypot(
            Math.max(x, window.innerWidth - x),
            Math.max(y, window.innerHeight - y)
        );

        document.body.classList.add('theme-transitioning');

        const transition = document.startViewTransition(() => {
            applyTheme(nextTheme, true);
        });

        transition.ready.then(() => {
            // Animate clip-path on the new layer expanding outwards from the center of the page
            const animation = document.documentElement.animate(
                {
                    clipPath: [
                        `circle(0px at ${x}px ${y}px)`,
                        `circle(${endRadius}px at ${x}px ${y}px)`
                    ]
                },
                {
                    duration: 400,
                    pseudoElement: '::view-transition-new(root)'
                }
            );

            animation.onfinish = () => {
                document.body.classList.remove('theme-transitioning');
            };
        });
    });
}

function applyTheme(theme, saveToStorage = true) {
    const isLight = theme === 'light';
    htmlEl.setAttribute('data-theme', isLight ? 'light' : 'dark');

    if (iconSun && iconMoon) {
        if (isLight) {
            iconSun.classList.remove('hidden');
            iconMoon.classList.add('hidden');
        } else {
            iconSun.classList.add('hidden');
            iconMoon.classList.remove('hidden');
        }
    }

    if (saveToStorage) localStorage.setItem('theme', theme);
}