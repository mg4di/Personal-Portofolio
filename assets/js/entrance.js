(function(){
    function finishLoad(){
        requestAnimationFrame(function(){
            requestAnimationFrame(function(){
                document.body.classList.remove('is-loading');
                document.body.classList.add('is-loaded');
            });
        });
    }
    if (document.readyState === 'complete') finishLoad();
    else window.addEventListener('load', finishLoad);
})();
