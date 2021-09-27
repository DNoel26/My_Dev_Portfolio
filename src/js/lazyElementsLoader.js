/** @format */

export const lazyElementsLoader = (UI, recaptchaCallback) => {
    // Lazy load images
    const init_lazy_imgs = [].slice.call(UI.lazy_imgs);

    // Lazy load image sources (picture tag)
    const init_lazy_sources = [].slice.call(UI.lazy_sources);

    // Lazy load background images in CSS
    const init_lazy_bgs = [].slice.call(UI.lazy_bgs);
    const init_grecaptchas = [].slice.call(UI.grecaptchas);
    const options = {
        root: null,
        rootMargin: '2000px',
        threshold: 0,
    };
    if ('IntersectionObserver' in window) {
        // Lazy Images
        const lazy_img_observer = new IntersectionObserver(function (
            entries,
            observer,
        ) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    const lazy_image = entry.target;
                    const lazy_data_src = lazy_image.getAttribute('data-src');
                    const lazy_data_srcset =
                        lazy_image.getAttribute('data-srcset');

                    if (lazy_image.hasAttribute('data-src')) {
                        lazy_image.setAttribute('src', lazy_data_src);
                        lazy_image.removeAttribute('data-src');
                    }

                    if (lazy_image.hasAttribute('data-srcset')) {
                        lazy_image.setAttribute('srcset', lazy_data_srcset);
                        lazy_image.removeAttribute('data-srcset');
                    }

                    lazy_image.classList.remove('lazy');
                    lazy_img_observer.unobserve(entry.target);
                }
            });
        },
        options);
        init_lazy_imgs.forEach(function (lazy_img) {
            lazy_img_observer.observe(lazy_img);
        });

        // Lazy Image Sources
        const lazy_source_observer = new IntersectionObserver(function (
            entries,
            observer,
        ) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    const lazy_source = entry.target;
                    const lazy_data_srcset =
                        lazy_source.getAttribute('data-srcset');

                    if (lazy_source.hasAttribute('data-srcset')) {
                        lazy_source.setAttribute('srcset', lazy_data_srcset);
                        lazy_source.removeAttribute('data-srcset');
                    }

                    lazy_source_observer.unobserve(entry.target);
                }
            });
        },
        options);
        init_lazy_sources.forEach(function (lazy_source) {
            lazy_source_observer.observe(lazy_source);
        });

        // Lazy Bg
        const lazy_bg_observer = new IntersectionObserver(function (
            entries,
            observer,
        ) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('load-now');
                    lazy_bg_observer.unobserve(entry.target);
                }
            });
        },
        options);
        init_lazy_bgs.forEach(function (lazy_bg) {
            lazy_bg_observer.observe(lazy_bg);
        });
        const grecaptcha_observer = new IntersectionObserver(function (
            entries,
            observer,
        ) {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    new Promise((resolve, reject) => {
                        UI.create_scripts(
                            'https://www.google.com/recaptcha/api.js?render=explicit',
                        );
                        setTimeout(resolve, 2000);
                    })
                        .then(async () => {
                            // Checks to see if recaptcha has loaded correctly and *if not, makes up to 10 attempts to reload*
                            await recaptchaCallback(() => {
                                const grecaptcha_check = function () {
                                    if (UI.grecaptchas.length > 0) {
                                        UI.my_form_button.removeAttribute(
                                            'disabled',
                                        );
                                        grecaptcha_observer.unobserve(
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
                                            grecaptcha_check();
                                        }, 15000);
                                    }
                                };
                                grecaptcha_check();
                            });
                        })
                        .catch((err) =>
                            console.log('Error in script delay promise: ', err),
                        );
                }
            });
        },
        options);
        init_grecaptchas.forEach((element) => {
            grecaptcha_observer.observe(element);
        });
    }
};
