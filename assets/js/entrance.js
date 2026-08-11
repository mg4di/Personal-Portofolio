(function () {
    'use strict';

    // Force browser to scroll to the top (Hero Section) on reload
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    window.addEventListener('beforeunload', function () {
        window.scrollTo(0, 0);
    });

    // Check if the page was refreshed or came from an internal page
    const navEntries = performance.getEntriesByType('navigation');
    const isReload = navEntries.length > 0 && navEntries[0].type === 'reload';

    const isInternalNavigation =
        document.referrer &&
        document.referrer.startsWith(window.location.origin) &&
        !isReload;

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

    // If coming from another page on the same site (and NOT refreshing), skip animation
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

    // Play full animation (First time landing on site OR Page Refresh)
    function initEntrance() {
        // Ensure top position again when entrance starts
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
            }, 1900);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initEntrance);
    } else {
        initEntrance();
    }
})();