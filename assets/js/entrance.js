(function () {
    'use strict';

    const navEntries = performance.getEntriesByType('navigation');
    const isReload = navEntries.length > 0 && navEntries[0].type === 'reload';

    // Check if the current page is NOT index.html
    const isIndexPage =
        window.location.pathname.endsWith('index.html') ||
        window.location.pathname === '/' ||
        window.location.pathname === '';

    // If reloading on a project detail page, set a redirect flag and navigate to index.html hero section
    if (isReload && !isIndexPage) {
        sessionStorage.setItem('playEntrance', 'true');
        window.location.href = 'index.html#home';
        return;
    }

    // Check if redirected from a detail page refresh
    const forceEntrance = sessionStorage.getItem('playEntrance') === 'true';
    if (forceEntrance) {
        sessionStorage.removeItem('playEntrance');
    }

    // Force browser to scroll to the top (Hero Section) on reload
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    window.addEventListener('beforeunload', function () {
        window.scrollTo(0, 0);
    });

    // Determine internal navigation status
    // Override skip behavior if forceEntrance is true
    const isInternalNavigation =
        document.referrer &&
        document.referrer.startsWith(window.location.origin) &&
        !isReload &&
        !forceEntrance;

    // Helper function to instantly hide preloader on internal page clicks
    function skipEntrance() {
        document.body.classList.remove('is-loading');
        document.body.classList.add('is-finished');

        const loader = document.getElementById('namma-loader');
        if (loader) {
            loader.style.display = 'none';
            loader.setAttribute('aria-hidden', 'true');
        }
    }

    // If coming from another page on the same site (and NOT refreshing/forced), skip animation
    if (isInternalNavigation) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', skipEntrance);
        } else {
            skipEntrance();
        }
        return;
    }

    // Skip if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
        skipEntrance();
        return;
    }

    // Play full animation (First time landing on site, index page refresh, OR detail page refresh redirect)
    function initEntrance() {
        window.scrollTo(0, 0);

        const loader = document.getElementById('namma-loader');
        const counterEl = document.getElementById('loader-counter');

        if (!loader || !counterEl) return;

        let progress = 0;

        requestAnimationFrame(function () {
            requestAnimationFrame(function () {
                document.body.classList.add('is-loading');
            });
        });

        const counterInterval = setInterval(function () {
            progress += Math.floor(Math.random() * 3) + 1;

            if (progress >= 100) {
                progress = 100;
                clearInterval(counterInterval);
                counterEl.textContent = '100%';

                setTimeout(completeEntrance, 200);
            } else {
                counterEl.textContent = (progress < 10 ? '0' : '') + progress + '%';
            }
        }, 30);

        function completeEntrance() {
            document.body.classList.remove('is-loading');
            document.body.classList.add('is-finished');

            setTimeout(function () {
                loader.setAttribute('aria-hidden', 'true');
                loader.style.display = 'none';
            }, 1600);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initEntrance);
    } else {
        initEntrance();
    }
})();