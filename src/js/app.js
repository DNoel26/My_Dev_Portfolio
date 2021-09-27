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
    calculate_age,
    debounce,
    throttle,
    scroll_progress,
    generate_dark_color_hex,
    media_queries,
} from './Business_Logic/Functions.js';
import Skill_Rating from './Business_Logic/SkillRating.js';
import { lazyElementsLoader } from './lazyElementsLoader.js';
import { myServicesCarouselLoader } from './myServicesCarouselLoader.js';
import { tagCloudLoader } from './tagCloudLoader.js';
import { devProjectsLoader } from './devProjectsLoader.js';
import { contactFormLoader } from './contactFormLoader.js';

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
            fetch('/dev_projects.json')
                .then((resp) => resp.json())
                .then((data) => {
                    return console.log(data);
                })
                .catch((err) => {
                    return console.log(err);
                });
        })();

        lazyElementsLoader(UI, recaptchaCallback);

        /*** GENERAL ***/
        UI.body.classList.add('will-change-height');
        UI.header.classList.add('will-change-height');
        UI.my_form_button.setAttribute('disabled', 'disabled');
        document.documentElement.style.scrollBehavior = 'auto';

        // Set new poster image if on mobile device
        // Load BG video from selection
        UI.add_poster_img_sm();
        UI.load_bg_vid();
        window.addEventListener(
            'resize',
            debounce(function () {
                UI.add_poster_img_sm();
                UI.load_bg_vid();
            }, 500),
        );

        // Delay load of non-essential scripts
        setTimeout(() => {
            media_queries(
                window.matchMedia('(min-width: 768px)'),
                () => {
                    return UI.create_scripts(
                        'https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js',
                    );
                },
                () => {
                    return;
                },
            );
        }, 2000);
        setTimeout(() => {
            return UI.create_scripts(
                'https://code.tidio.co/edv8badlavwvekyo42tfkxyp6frut7yq.js',
                'https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js',
            );
        }, 10000);

        // Loads Resume via Google Preview on click only
        let google_preview_btn_is_clicked = false;
        (function () {
            UI.google_preview_modal_btn.addEventListener('click', () => {
                if (!google_preview_btn_is_clicked) {
                    UI.google_preview_modal.setAttribute(
                        'src',
                        'https://drive.google.com/file/d/1fHBSLAaqd7pVWZ7lZr7jAOXBCZB0yXmT/preview',
                    );
                    google_preview_btn_is_clicked = true;
                }
            });
        })();
        let show_header = true;
        let scroll_limit = 0;
        let hide_header_limit = 200;
        let scroll_moved = false;
        let scroll_top_reset = true;
        let header_vid_ended = false;
        let scroll_timer;
        let is_scrolling = false;
        let anchor_is_scrolled = false;
        const header_timer_delay = 3000;

        // Allows the reveal of the hidden section below header for keyboard users
        UI.above_placeholder.addEventListener('focus', () => {
            // Set y-scroll to height > than what header would change to (shrink) after scrolling from top
            window.scrollBy(0, 170);
        });

        UI.anchor_links.forEach((link) => {
            link.addEventListener('click', (e) => {
                if (!anchor_is_scrolled) {
                    e.preventDefault();
                    window.scrollBy(0, 170);
                    anchor_is_scrolled = true;
                    setTimeout(() => {
                        // allows 'jump' to anchor if clicked
                        // header
                        link.click();
                    }, 1500);
                }
            });
        });

        // Sets the timer for the header hide/show function (timer to be cleared on window scroll or element hover)
        const header_timer = function () {
            return (scroll_timer = window.setTimeout(() => {
                if (!show_header) {
                    UI.header.classList.add('hide-header');
                    UI.header.classList.remove('show-header');
                    is_scrolling = false;
                }
            }, header_timer_delay));
        };

        // Controls the side menu (tablet) and mobile menu functions
        const side_menu_toggler = () => {
            if (!UI.toggler_btn.classList.contains('collapsed')) {
                UI.side_menu_reveal();
            } else {
                UI.side_menu_hide();
            }
        };
        const mobile_menu_toggler = () => {
            if (!UI.toggler_btn.classList.contains('collapsed')) {
                UI.mobile_menu_reveal();
            } else {
                UI.mobile_menu_hide();
            }
        };
        const mq_menu_toggler = () => {
            const mq_limits = [
                window.matchMedia('(max-width: 767.98px)'),
                window.matchMedia(
                    '(min-width: 768px) and (max-width: 991.98px)',
                ),
            ];
            media_queries(mq_limits[0], mobile_menu_toggler, null);
            media_queries(mq_limits[1], side_menu_toggler, null);
        };
        UI.toggler_btn.addEventListener('click', mq_menu_toggler);
        window.addEventListener(
            'resize',
            debounce(function () {
                UI.no_menu();
            }, 500),
        );

        // Removes video after playing once and then adds a static background image (refresh to play video again)
        UI.header_vid.addEventListener('ended', () => {
            UI.replace_vid_bg();
            UI.header_vid.remove();
            header_vid_ended = true;
        });

        // Removes poster or bg if video fails to load and then adds a static background image
        UI.header_vid.addEventListener('animationend', () => {
            setTimeout(() => {
                UI.replace_vid_bg();
                UI.header_vid.remove();
                header_vid_ended = true;
            }, 3000);
        });

        // Controls the Scroll Events
        (function () {
            const header_transform = function () {
                // Resize header when scrolling - adds artificial height to compensate for reduction in header height and aid in smooth transitioning
                if (
                    (document.documentElement.scrollTop > scroll_limit ||
                        window.pageYOffset > scroll_limit) &&
                    scroll_moved === false
                ) {
                    UI.shrink_header();
                    UI.expand_placeholder_div();
                    scroll_moved = true;
                    anchor_is_scrolled = true;
                } else if (
                    (document.documentElement.scrollTop <= scroll_limit ||
                        window.pageYOffset <= scroll_limit) &&
                    scroll_moved === true
                ) {
                    UI.expand_header();
                    UI.shrink_placeholder_div();

                    if (scroll_moved && header_vid_ended) {
                        UI.replace_vid_bg();
                    }
                    scroll_moved = false;
                    scroll_top_reset = true;
                }
            };

            // Checks scroll position on load or refresh and executes
            if (
                document.documentElement.scrollTop > scroll_limit ||
                window.pageYOffset > scroll_limit
            ) {
                scroll_top_reset = false;
                header_transform();
            }

            const scroll_moved_debounce_wrapper = debounce(function () {
                scroll_moved = false;
            }, 800);
            const sticky_header_throttle_wrapper = throttle(function () {
                header_transform();
            }, 100);

            // Adjusts header to match screen size if resized
            window.addEventListener(
                'resize',
                debounce(() => {
                    header_transform();
                    show_header = true;
                    clearTimeout(scroll_timer);
                }, 200),
            );

            // Stops the header timer when mouse hovers over the header
            UI.header.addEventListener('mouseover', () => {
                show_header = true;
                clearTimeout(scroll_timer);
            });

            // Stops the header timer when mouse moves over the header
            UI.header.addEventListener('mousemove', () => {
                show_header = true;
                clearTimeout(scroll_timer);
            });

            // Stops the header timer when screen is touched on the header
            UI.header.addEventListener(
                'touchstart',
                () => {
                    show_header = true;
                    clearTimeout(scroll_timer);
                },
                { passive: true },
            );

            // Stops the header timer when screen is moved on the header
            UI.header.addEventListener(
                'touchmove',
                () => {
                    show_header = true;
                    clearTimeout(scroll_timer);
                },
                { passive: true },
            );

            // Resumes header timer to hide header when mouse leaves the element
            UI.header.addEventListener('mouseout', () => {
                if (
                    (document.documentElement.scrollTop > hide_header_limit ||
                        window.pageYOffset > hide_header_limit) &&
                    !UI.bot_nav_collapse.classList.contains('show')
                ) {
                    header_timer();
                }
            });

            // Stops the header timer when when header buttons are focused
            UI.header_btns.forEach((btn) => {
                btn.addEventListener('focus', () => {
                    show_header = true;
                    clearTimeout(scroll_timer);
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
            UI.header_links.forEach((link) => {
                link.addEventListener('click', (e) => {
                    let scroll_check;
                    let href_hash = link.getAttribute('href');
                    if (href_hash.includes('#')) {
                        ///log console.log('header link clicked');
                        // e.preventDefault();
                        // document
                        //     .getElementById(`${href_hash.slice(1)}`)
                        //     .scrollIntoView();
                        scroll_check = setInterval(() => {
                            ///log console.log('scroll checking on header link click!', is_scrolling);
                            if (!is_scrolling) {
                                if (
                                    !UI.toggler_btn.classList.contains(
                                        'collapsed',
                                    )
                                )
                                    UI.toggler_btn.click();
                                clearInterval(scroll_check);
                            }
                        }, 500);
                    }
                });
            });

            //Hides header on scroll and returns to normal position when stopped after a few seconds
            document.addEventListener(
                'scroll',
                throttle(() => {
                    is_scrolling = true;
                    let is_scrolling_timer;
                    clearTimeout(is_scrolling_timer);
                    is_scrolling_timer = setTimeout(() => {
                        is_scrolling = false;
                    }, 300);
                    if (
                        document.documentElement.scrollTop > scroll_limit ||
                        window.pageYOffset > scroll_limit
                    )
                        show_header = false;
                    else {
                        show_header = true;
                        anchor_is_scrolled = false;
                    }

                    // Clear previous timer and reset
                    clearTimeout(scroll_timer);

                    // Hides the header on scroll stop or shows while scrolling or hovering on element (debounces while scrolling)
                    if (
                        !show_header &&
                        (document.documentElement.scrollTop >
                            hide_header_limit ||
                            window.pageYOffset > hide_header_limit)
                    ) {
                        if (UI.bot_nav_collapse.classList.contains('show')) {
                            show_header = true;
                            return;
                        }
                        UI.header.classList.remove('hide-header');
                        UI.header.classList.add('show-header');
                        header_timer();
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
                    scroll_progress(UI.scroll_indicator);
                }, 300),
                { passive: true },
            );
            document.addEventListener('scroll', scroll_moved_debounce_wrapper, {
                passive: true,
            });
            document.addEventListener(
                'touchmove',
                scroll_moved_debounce_wrapper,
                {
                    passive: true,
                },
            );
            document.addEventListener(
                'touchstart',
                scroll_moved_debounce_wrapper,
                {
                    passive: true,
                },
            );
            document.addEventListener(
                'scroll',
                sticky_header_throttle_wrapper,
                {
                    passive: true,
                },
            );
            document.addEventListener(
                'touchmove',
                sticky_header_throttle_wrapper,
                {
                    passive: true,
                },
            );
            document.addEventListener(
                'touchstart',
                sticky_header_throttle_wrapper,
                {
                    passive: true,
                },
            );
        })();

        /*** HOME SECTION ***/
        // Animate "Developer Portfolio"
        UI.animate_letters();

        /*** ABOUT ME SECTION ***/
        // Automatically adjust my age in bio based on date
        UI.my_age.innerHTML = calculate_age();

        // Adds a fade in and out effect when clicking the button in my bio
        UI.summary_btn.addEventListener('click', () => {
            UI.change_about_info();
        });

        /*** MY SERVICES SECTION ***/
        let my_carousel_btn_click = false;

        // Changes carousel horizontal scroll amount depending on the screen size
        myServicesCarouselLoader(UI, media_queries, debounce, throttle);

        /*** TOOLS & TECHNOLOGIES SECTION ***/
        /** Tag Cloud **/
        tagCloudLoader(UI, media_queries, generate_dark_color_hex, debounce);

        // Display star rating for each tool / technology based on skill level
        UI.populate_skill_rating(new Skill_Rating());

        /*** PROJECTS SECTION ***/
        // Create Projects
        devProjectsLoader(UI);

        /*** CONTACT SECTION ***/
        /** Formspree validation **/
        // Example starter JavaScript for disabling form submissions if there
        // are invalid fields
        contactFormLoader(UI, debounce, recaptchaCallback);
    }); // end of DOMContentLoaded event listener
}; // end of init()
// end of App

App.init();
