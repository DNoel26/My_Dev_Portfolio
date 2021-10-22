/** @format */

'use strict';
console.time('App Loaded Successfully in');
require('../css/style.css');
require('../css/mq.css');

const cache = {};
function importAll(r) {
    r.keys().forEach((key) => (cache[key] = r(key)));
}
importAll(require.context('../assets/', true, /\.pdf$/));
importAll(require.context('../media/', true, /\.mp4$/));
import UI from './UI_Logic/UI.js';
import {
    calculateAge,
    debounce,
    throttle,
    scrollProgress,
    mediaQueries,
} from './Business_Logic/custom-functions.js';
import SkillRating from './Business_Logic/SkillRating.js';
import { lazyElementsLoader } from './lazy-elements-loader.js';
import { myServicesCarouselLoader } from './my-services-carousel-loader.js';
import { tagCloudLoader } from './tag-cloud-loader.js';
import { projectsLoader } from './projects-loader.js';
import { contactFormLoader } from './contact-form-loader.js';
import { hotjar } from './hotjar.js';

// Google recaptcha data function (function name must be same as data-callback attribute value)
const recaptchaCallback = function recaptchaCallback(func) {
    return func();
};

const App = {};
App.init = () => {
    /*** Main Document ***/
    document.addEventListener('DOMContentLoaded', () => {
        ///log console.log('App Loaded Successfully');
        console.timeEnd('App Loaded Successfully in');
        ///log console.log('DOMContentLoaded Successfully');

        //TODO Convert dev and prod projects to json files and use in project section
        (function () {
            fetch('/dev-projects.json')
                .then((resp) => resp.json())
                .then((data) => {
                    return console.log(data);
                })
                .catch((err) => {
                    return console.log(err);
                });
        })();

        lazyElementsLoader(recaptchaCallback);

        /*** GENERAL ***/
        UI.body.classList.add('will-change-height');
        UI.header.classList.add('will-change-height');
        UI.myFormBtn.setAttribute('disabled', 'disabled');
        document.documentElement.style.scrollBehavior = 'auto';

        // Set new poster image if on mobile device
        // Load BG video from selection
        UI.addPosterImgSm();
        UI.loadBgVid();
        window.addEventListener(
            'resize',
            debounce(function () {
                UI.addPosterImgSm();
                UI.loadBgVid();
            }, 500),
        );

        // Delay load of non-essential scripts
        setTimeout(() => {
            mediaQueries(
                window.matchMedia('(min-width: 768px)'),
                () => {
                    return UI.createScripts(
                        'https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js',
                    );
                },
                () => {
                    return;
                },
            );
        }, 2000);
        setTimeout(() => {
            hotjar(
                window,
                document,
                'https://static.hotjar.com/c/hotjar-',
                '.js?sv=',
            );
            return UI.createScripts(
                'https://code.tidio.co/edv8badlavwvekyo42tfkxyp6frut7yq.js',
                'https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js',
            );
        }, 10000);

        // Loads Resume via Google Preview on click only
        let googlePreviewBtnIsClicked = false;
        (function () {
            UI.googlePreviewModalBtn.addEventListener('click', () => {
                if (!googlePreviewBtnIsClicked) {
                    UI.googlePreviewModal.setAttribute(
                        'src',
                        'https://drive.google.com/file/d/1C14OwVUtdLrPcs8e7_cPwp3R65dRjoS1/preview',
                    );
                    googlePreviewBtnIsClicked = true;
                }
            });
        })();
        let showHeader = true;
        let scrollLimit = 0;
        let hideHeaderLimit = 200;
        let scrollMoved = false;
        let scrollTopReset = true;
        let headerVidEnded = false;
        let scrollTimer;
        let isScrolling = false;
        let anchorIsScrolled = false;
        const headerTimerDelay = 3000;

        // Allows the reveal of the hidden section below header for keyboard users
        UI.abovePlaceholder.addEventListener('focus', () => {
            // Set y-scroll to height > than what header would change to (shrink) after scrolling from top
            window.scrollBy(0, 170);
        });

        UI.anchorLinks.forEach((link) => {
            link.addEventListener('click', (e) => {
                if (!anchorIsScrolled) {
                    e.preventDefault();
                    window.scrollBy(0, 170);
                    anchorIsScrolled = true;
                    setTimeout(() => {
                        // allows 'jump' to anchor if clicked
                        // header
                        link.click();
                    }, 1500);
                }
            });
        });

        // Sets the timer for the header hide/show function (timer to be cleared on window scroll or element hover)
        const headerTimer = function () {
            return (scrollTimer = window.setTimeout(() => {
                if (!showHeader) {
                    UI.header.classList.add('hide-header');
                    UI.header.classList.remove('show-header');
                    isScrolling = false;
                }
            }, headerTimerDelay));
        };

        // Controls the side menu (tablet) and mobile menu functions
        const sideMenuToggler = () => {
            if (!UI.togglerBtn.classList.contains('collapsed')) {
                UI.sideMenuReveal();
            } else {
                UI.sideMenuHide();
            }
        };
        const mobileMenuToggler = () => {
            if (!UI.togglerBtn.classList.contains('collapsed')) {
                UI.mobileMenuReveal();
            } else {
                UI.mobileMenuHide();
            }
        };
        const mqMenuToggler = () => {
            const mqLimits = [
                window.matchMedia('(max-width: 767.98px)'),
                window.matchMedia(
                    '(min-width: 768px) and (max-width: 991.98px)',
                ),
            ];
            mediaQueries(mqLimits[0], mobileMenuToggler, null);
            mediaQueries(mqLimits[1], sideMenuToggler, null);
        };
        UI.togglerBtn.addEventListener('click', mqMenuToggler);
        window.addEventListener(
            'resize',
            debounce(function () {
                UI.noMenu();
            }, 500),
        );

        // Removes video after playing once and then adds a static background image (refresh to play video again)
        UI.headerVid.addEventListener('ended', () => {
            UI.replaceVidBg();
            UI.headerVid.remove();
            headerVidEnded = true;
        });

        // Removes poster or bg if video fails to load and then adds a static background image
        UI.headerVid.addEventListener('animationend', () => {
            setTimeout(() => {
                UI.replaceVidBg();
                UI.headerVid.remove();
                headerVidEnded = true;
            }, 3000);
        });

        // Controls the Scroll Events
        (function () {
            const headerTransform = function () {
                // Resize header when scrolling - adds artificial height to compensate for reduction in header height and aid in smooth transitioning
                if (
                    (document.documentElement.scrollTop > scrollLimit ||
                        window.pageYOffset > scrollLimit) &&
                    scrollMoved === false
                ) {
                    UI.shrinkHeader();
                    UI.expandPlaceholderDiv();
                    scrollMoved = true;
                    anchorIsScrolled = true;
                } else if (
                    (document.documentElement.scrollTop <= scrollLimit ||
                        window.pageYOffset <= scrollLimit) &&
                    scrollMoved === true
                ) {
                    UI.expandHeader();
                    UI.shrinkPlaceholderDiv();

                    if (scrollMoved && headerVidEnded) {
                        UI.replaceVidBg();
                    }
                    scrollMoved = false;
                    scrollTopReset = true;
                }
            };

            // Checks scroll position on load or refresh and executes
            if (
                document.documentElement.scrollTop > scrollLimit ||
                window.pageYOffset > scrollLimit
            ) {
                scrollTopReset = false;
                headerTransform();
            }

            const scrollMovedDebounceWrapper = debounce(function () {
                scrollMoved = false;
            }, 800);
            const stickyHeaderThrottleWrapper = throttle(function () {
                headerTransform();
            }, 100);

            // Adjusts header to match screen size if resized
            window.addEventListener(
                'resize',
                debounce(() => {
                    headerTransform();
                    showHeader = true;
                    clearTimeout(scrollTimer);
                }, 200),
            );

            // Stops the header timer when mouse hovers over the header
            UI.header.addEventListener('mouseover', () => {
                showHeader = true;
                clearTimeout(scrollTimer);
            });

            // Stops the header timer when mouse moves over the header
            UI.header.addEventListener('mousemove', () => {
                showHeader = true;
                clearTimeout(scrollTimer);
            });

            // Stops the header timer when screen is touched on the header
            UI.header.addEventListener(
                'touchstart',
                () => {
                    showHeader = true;
                    clearTimeout(scrollTimer);
                },
                { passive: true },
            );

            // Stops the header timer when screen is moved on the header
            UI.header.addEventListener(
                'touchmove',
                () => {
                    showHeader = true;
                    clearTimeout(scrollTimer);
                },
                { passive: true },
            );

            // Resumes header timer to hide header when mouse leaves the element
            UI.header.addEventListener('mouseout', () => {
                if (
                    (document.documentElement.scrollTop > hideHeaderLimit ||
                        window.pageYOffset > hideHeaderLimit) &&
                    !UI.botNavCollapse.classList.contains('show')
                ) {
                    headerTimer();
                }
            });

            // Stops the header timer when when header buttons are focused
            UI.headerBtns.forEach((btn) => {
                btn.addEventListener('focus', () => {
                    showHeader = true;
                    clearTimeout(scrollTimer);
                });
            });

            // Stops the header timer when header links are focused
            // UI.header_links.forEach((link) => {
            //     link.addEventListener('focus', () => {
            //         show_header = true;
            //         clearTimeout(scroll_timer);
            //     });
            // });

            // Hides the header timer when header links are clicked and
            // prevents header from disappearing while scrolling
            UI.headerLinks.forEach((link) => {
                link.addEventListener('click', (e) => {
                    let scrollCheck;
                    let hrefHash = link.getAttribute('href');
                    if (hrefHash.includes('#')) {
                        ///log console.log('header link clicked');
                        // e.preventDefault();
                        // document
                        //     .getElementById(`${href_hash.slice(1)}`)
                        //     .scrollIntoView();
                        scrollCheck = setInterval(() => {
                            ///log console.log('scroll checking on header link click!', is_scrolling);
                            if (!isScrolling) {
                                if (
                                    !UI.togglerBtn.classList.contains(
                                        'collapsed',
                                    )
                                )
                                    UI.togglerBtn.click();
                                clearInterval(scrollCheck);
                            }
                        }, 500);
                    }
                });
            });

            //Hides header on scroll and returns to normal position when stopped after a few seconds
            document.addEventListener(
                'scroll',
                throttle(() => {
                    isScrolling = true;
                    let isScrollingTimer;
                    clearTimeout(isScrollingTimer);
                    isScrollingTimer = setTimeout(() => {
                        isScrolling = false;
                    }, 300);
                    if (
                        document.documentElement.scrollTop > scrollLimit ||
                        window.pageYOffset > scrollLimit
                    )
                        showHeader = false;
                    else {
                        showHeader = true;
                        anchorIsScrolled = false;
                    }

                    // Clear previous timer and reset
                    clearTimeout(scrollTimer);

                    // Hides the header on scroll stop or shows while scrolling or hovering on element (debounces while scrolling)
                    if (
                        !showHeader &&
                        (document.documentElement.scrollTop > hideHeaderLimit ||
                            window.pageYOffset > hideHeaderLimit)
                    ) {
                        if (UI.botNavCollapse.classList.contains('show')) {
                            showHeader = true;
                            return;
                        }
                        UI.header.classList.remove('hide-header');
                        UI.header.classList.add('show-header');
                        headerTimer();
                    } else {
                        UI.header.classList.remove('hide-header');
                        UI.header.classList.add('show-header');
                    }
                }, 100),
                { passive: true },
            );
            document.addEventListener(
                'scroll',
                debounce(() => {
                    scrollProgress(UI.scrollIndicator);
                }, 300),
                { passive: true },
            );
            document.addEventListener('scroll', scrollMovedDebounceWrapper, {
                passive: true,
            });
            document.addEventListener('touchmove', scrollMovedDebounceWrapper, {
                passive: true,
            });
            document.addEventListener(
                'touchstart',
                scrollMovedDebounceWrapper,
                {
                    passive: true,
                },
            );
            document.addEventListener('scroll', stickyHeaderThrottleWrapper, {
                passive: true,
            });
            document.addEventListener(
                'touchmove',
                stickyHeaderThrottleWrapper,
                {
                    passive: true,
                },
            );
            document.addEventListener(
                'touchstart',
                stickyHeaderThrottleWrapper,
                {
                    passive: true,
                },
            );
        })();

        /*** HOME SECTION ***/
        // Animate "Developer Portfolio"
        UI.animateLetters();

        /*** ABOUT ME SECTION ***/
        // Automatically adjust my age in bio based on date
        UI.myAge.innerHTML = calculateAge();

        // Adds a fade in and out effect when clicking the button in my bio
        UI.summaryBtn.addEventListener('click', () => {
            UI.changeAboutInfo();
        });

        /*** MY SERVICES SECTION ***/
        let my_carousel_btn_click = false;

        // Changes carousel horizontal scroll amount depending on the screen size
        myServicesCarouselLoader();

        /*** TOOLS & TECHNOLOGIES SECTION ***/
        /** Tag Cloud **/
        tagCloudLoader();

        // Display star rating for each tool / technology based on skill level
        UI.populateSkillRating(new SkillRating());

        /*** PROJECTS SECTION ***/
        // Create Projects
        projectsLoader();

        /*** CONTACT SECTION ***/
        /** Formspree validation **/
        // Example starter JavaScript for disabling form submissions if there
        // are invalid fields
        contactFormLoader(recaptchaCallback);
    }); // end of DOMContentLoaded event listener
}; // end of init()
// end of App

App.init();
