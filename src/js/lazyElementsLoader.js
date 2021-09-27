/** @format */

import UI from "./UI_Logic/UI.js";

export const lazyElementsLoader = (recaptchaCallback) => {
    // Lazy load images
    const initLazyImgs = [].slice.call(UI.lazyImgs);

    // Lazy load image sources (picture tag)
    const initLazySources = [].slice.call(UI.lazySources);

    // Lazy load background images in CSS
    const initLazyBgs = [].slice.call(UI.lazyBgs);
    const initGrecaptchas = [].slice.call(UI.grecaptchas);
    const options = {
        root: null,
        rootMargin: '2000px',
        threshold: 0,
    };
    if ('IntersectionObserver' in window) {
        // Lazy Images
        const lazyImgObserver = new IntersectionObserver(function (
            entries,
            observer,
        ) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    const lazyImage = entry.target;
                    const lazyDataSrc = lazyImage.getAttribute('data-src');
                    const lazyDataSrcset =
                        lazyImage.getAttribute('data-srcset');

                    if (lazyImage.hasAttribute('data-src')) {
                        lazyImage.setAttribute('src', lazyDataSrc);
                        lazyImage.removeAttribute('data-src');
                    }

                    if (lazyImage.hasAttribute('data-srcset')) {
                        lazyImage.setAttribute('srcset', lazyDataSrcset);
                        lazyImage.removeAttribute('data-srcset');
                    }

                    lazyImage.classList.remove('lazy');
                    lazyImgObserver.unobserve(entry.target);
                }
            });
        },
        options);
        initLazyImgs.forEach(function (lazyImg) {
            lazyImgObserver.observe(lazyImg);
        });

        // Lazy Image Sources
        const lazySourceObserver = new IntersectionObserver(function (
            entries,
            observer,
        ) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    const lazySource = entry.target;
                    const lazyDataSrcset =
                        lazySource.getAttribute('data-srcset');

                    if (lazySource.hasAttribute('data-srcset')) {
                        lazySource.setAttribute('srcset', lazyDataSrcset);
                        lazySource.removeAttribute('data-srcset');
                    }

                    lazySourceObserver.unobserve(entry.target);
                }
            });
        },
        options);
        initLazySources.forEach(function (lazy_source) {
            lazySourceObserver.observe(lazy_source);
        });

        // Lazy Bg
        const lazyBgObserver = new IntersectionObserver(function (
            entries,
            observer,
        ) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('load-now');
                    lazyBgObserver.unobserve(entry.target);
                }
            });
        },
        options);
        initLazyBgs.forEach(function (lazyBg) {
            lazyBgObserver.observe(lazyBg);
        });
        const grecaptchaObserver = new IntersectionObserver(function (
            entries,
            observer,
        ) {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    new Promise((resolve, reject) => {
                        UI.createScripts(
                            'https://www.google.com/recaptcha/api.js?render=explicit',
                        );
                        setTimeout(resolve, 2000);
                    })
                        .then(async () => {
                            // Checks to see if recaptcha has loaded correctly and *if not, makes up to 10 attempts to reload*
                            await recaptchaCallback(() => {
                                const grecaptchaCheck = function () {
                                    if (UI.grecaptchas.length > 0) {
                                        UI.myFormBtn.removeAttribute(
                                            'disabled',
                                        );
                                        grecaptchaObserver.unobserve(
                                            entry.target,
                                        );
                                        grecaptcha.render('recaptcha', {
                                            sitekey:
                                                '6LfWHkgaAAAAAIKEcuqTQiy82YSpeWTdjebsfWZ3',
                                            callback: () => {
                                                return;
                                            },
                                        });
                                    } else {
                                        setTimeout(() => {
                                            grecaptchaCheck();
                                        }, 15000);
                                    }
                                };
                                grecaptchaCheck();
                            });
                        })
                        .catch((err) =>
                            console.log('Error in script delay promise: ', err),
                        );
                }
            });
        },
        options);
        initGrecaptchas.forEach((element) => {
            grecaptchaObserver.observe(element);
        });
    }
};
