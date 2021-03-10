'use strict';

console.log("App.js Loaded Successfully");

import UI from "./UI_Logic/UI.js";
import { logger, calculate_age, wrapper_exec, wrapper_no_exec, debounce, throttle, scroll_progress,
    generate_dark_color_hex, form_submit_success, form_submit_error, ajax, media_queries} from "./Business_Logic/Functions.js";
import Skill_Rating from "./Business_Logic/SkillRating.js";
import Project from "./Business_Logic/Project.js";
//import Formspree from "./Business_Logic/Formspree.js";
import API from "./Business_Logic/API.js"

const App = {
    init() {

        /*** Main Document ***/

        document.addEventListener("DOMContentLoaded", ()=>{
            
            console.log("DOMContentLoaded Successfully");

             // Google recaptcha data function (function name must be same as data-callback attribute value)
             function recaptchaCallback(func) {
                
                return func();
            };

            /*** GENERAL ***/

            UI.body.classList.add("will-change-height");
            UI.header.classList.add("will-change-height");
            /*UI.all_imgs.forEach(img => {
                
                img.setAttribute("loading", "lazy");
            });*/
            
            // Delay load of non-essential scripts
            setTimeout(() => {
                
                return UI.create_scripts("https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js");
            }, 1000);

            setTimeout(() => {
                
                return UI.create_scripts("https://code.tidio.co/edv8badlavwvekyo42tfkxyp6frut7yq.js", "https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js", "https://www.google.com/recaptcha/api.js?render=explicit");
            }, 7000);

            // Checks to see if recaptcha has loaded correctly and if not, makes up to 10 attempts to reload
            setTimeout(() => {
                
                recaptchaCallback(() => {

                    let i = 0;

                    // Maximum of 10 attempts before requiring refresh
                    if(i > 9) return;

                    if(UI.grecaptcha.length > 0) {

                        i++;

                        grecaptcha.render("recaptcha", {

                            sitekey: "6LfWHkgaAAAAAIKEcuqTQiy82YSpeWTdjebsfWZ3",
                            callback: () => {

                                console.log(`Recaptcha failed to load after ${i} attempts`);
                            },
                        });

                        return;
                    };

                    //window.setTimeout(recaptchaCallback, 1000);
                });
            }, 7500);

            const options = {
                rootMargin: "10px",
                threshold: 0
            };

            let observer = new IntersectionObserver((entries) => {

                entries.forEach(entry => {
                    if(entry.intersectionRect.height > 0) {

                        console.log(entry)
                    } else {

                        console.log("else entry", entry)
                    }
                });
            }, options);

            let is_scrolling = false;
            let scroll_limit = 0;
            let scroll_moved = false;
            let scroll_top_reset = true;
            let scroll_timer;
            let header_vid_ended = false;

            /*const x = window.matchMedia("(max-width: 991.98px");
            media_queries(x, function() {
                this.nav_container.style.height = "35vh";    
            });*/

            (function() {

                const side_menu_toggler = () => {

                    if(!UI.toggler_btn.classList.contains("collapsed")) {
                        
                        UI.side_menu_reveal();
                    } else {
                        
                        UI.side_menu_hide();
                    };
                };

                const mobile_menu_toggler = () => {

                    if(!UI.toggler_btn.classList.contains("collapsed")) {
                        
                        UI.mobile_menu_reveal();
                    } else {
                        
                        UI.mobile_menu_hide();
                    };
                };

                const mq_menu_toggler = () => {

                    const mq_limits = [
                        window.matchMedia("(max-width: 767.98px)"),
                        window.matchMedia("(min-width: 768px) and (max-width: 991.98px)")
                    ];

                    media_queries(mq_limits[0], mobile_menu_toggler, null);
                    media_queries(mq_limits[1], side_menu_toggler, null);
                };

                UI.toggler_btn.addEventListener("click", mq_menu_toggler);
                window.addEventListener("resize", debounce(function() {
                    
                    UI.no_menu();
                }, 500));
            }());

            // Removes video after playing once and then adds a static background image (refresh to play video again)
            UI.header_vid.addEventListener("ended", ()=>{

                UI.replace_vid_bg();
                UI.header_vid.remove();
                header_vid_ended = true;
            }); 

            //let header_transition_shrink_end = false;
            //let header_transition_expand_end = false;

            /*UI.header.addEventListener('transitionend', (e) => {

                console.log("Animation ended ", e);
                if((document.documentElement.scrollTop > scroll_limit || window.pageYOffset > scroll_limit) && e.propertyName === "height") header_transition_shrink_end = true, header_transition_expand_end = false;
                else if((document.documentElement.scrollTop <= scroll_limit || window.pageYOffset <= scroll_limit) && e.propertyName === "height") header_transition_shrink_end = false, header_transition_expand_end = true;
            });*/

            // Scroll Events
            (function() {

                const header_transform = function() {

                    // Resize header when scrolling - adds artificial height to compensate for reduction in header height and aid in smooth transitioning
                    if((document.documentElement.scrollTop > scroll_limit || window.pageYOffset > scroll_limit) && scroll_moved === false) {
                    
                        UI.shrink_header();
                        UI.expand_placeholder_div();
   
                        //if(header_transition_shrink_end) UI.fixed_bottom_header();
                        scroll_moved = true;
                    } else if((document.documentElement.scrollTop <= scroll_limit || window.pageYOffset <= scroll_limit) && scroll_moved === true) {
                        
                        UI.expand_header();
                        UI.shrink_placeholder_div();
                        //if(header_transition_expand_end) UI.no_fixed_bottom_header();

                        if(scroll_moved && header_vid_ended) {
    
                            UI.replace_vid_bg();
                        };
                        
                        //clearTimeout(zz);
                        scroll_moved = false;
                        scroll_top_reset = true;
                        //window.scrollTo(0, 0);
                    };
                };

                // Checks scroll position on load or refresh and executes 
                if(document.documentElement.scrollTop > scroll_limit || window.pageYOffset > scroll_limit) scroll_top_reset = false;
                header_transform();

                const scroll_moved_debounce_wrapper = debounce(function() {
                    
                    scroll_moved = false;
                }, 800);

                const sticky_header_throttle_wrapper = throttle(function() {

                    header_transform();
                }, 100);

                window.addEventListener("resize", debounce(() => {

                    header_transform();
                    //if(document.documentElement.scrollTop > scroll_limit || window.pageYOffset > scroll_limit) return UI.fixed_bottom_header();
                    //else if(document.documentElement.scrollTop <= scroll_limit || window.pageYOffset <= scroll_limit) return UI.no_fixed_bottom_header(); 
                }, 200));

                //document.addEventListener("scroll", scroll_progress_debounce_wrapper);
                //document.addEventListener("touchmove", scroll_progress_debounce_wrapper);

                //Hides header on scroll and returns to normal position when stopped after a few seconds
                document.addEventListener("scroll", () => {

                    scroll_progress(UI.scroll_indicator);

                    if(document.documentElement.scrollTop > scroll_limit || window.pageYOffset > scroll_limit) is_scrolling = true;

                    if(document.documentElement.scrollTop <= scroll_limit || window.pageYOffset <= scroll_limit) is_scrolling = false;

                    if(is_scrolling) {

                        if(UI.bot_nav_collapse.classList.contains("show")) {

                            clearTimeout(scroll_timer);
                            return;
                        };

                        clearTimeout(scroll_timer);
                        UI.header.style.opacity = "unset";
                        UI.header.style.visibility = "unset";
                        
                        scroll_timer = setTimeout(() => {
                            
                            is_scrolling = false;
                            
                            if(!is_scrolling) {

                                UI.header.style.opacity = "0";
                                UI.header.style.visibility = "hidden";
                            };
                        }, 800);
                    } else {

                        clearTimeout(scroll_timer);
                        UI.header.style.opacity = "unset";
                        UI.header.style.visibility = "unset";
                    };
                });

                document.addEventListener("scroll", scroll_moved_debounce_wrapper);
                document.addEventListener("touchmove", scroll_moved_debounce_wrapper, {passive: true});

                document.addEventListener("scroll", sticky_header_throttle_wrapper);
                document.addEventListener("touchmove", sticky_header_throttle_wrapper, {passive: true});
            })();

            //Add active-list class to active link to work with CSS ::before and ::after settings (does not work well with animations for dropdown when active is set to the link itself)
            /*UI.active_lists.forEach(li => {
                    
                if(li.children[0].classList.contains("active")) {

                    li.classList.add("active-list");
                } else {

                    li.classList.remove("active-list"); 
                };
            });*/

            /*** HOME SECTION ***/

            // Animate "Developer Portfolio"
            UI.animate_letters();

            /*** ABOUT ME SECTION ***/

            // Automatically adjust my age in bio based on date
            UI.my_age.innerHTML = calculate_age(); 

            // Adds a fade in and out effect when clicking the button in my bio
            UI.summary_btn.addEventListener("click", ()=>{

                UI.change_about_info();
            });

            /*** MY SERVICES SECTION ***/

            let my_carousel_btn_click = false;

            // Changes scroll amount depending on the screen size
            (function() {
                
                let scroll_amt = 360;
                const mq_limits = [
                    window.matchMedia("(max-width: 320.98px)"),
                    window.matchMedia("(min-width: 321px) and (max-width: 575.98px)"),
                    window.matchMedia("(min-width: 576px) and (max-width: 767.98px)"),
                    window.matchMedia("(min-width: 768px) and (max-width: 991.98px)"),
                    window.matchMedia("(min-width: 992px) and (max-width: 1199.98px)"),
                    window.matchMedia("(min-width: 1200px) and (max-width: 1399.98px)"),
                    window.matchMedia("(min-width: 1400px)")
                ];

                const scroll_amt_modifier = function() {

                    media_queries(mq_limits[0], () => {
                        return scroll_amt = 280;
                    }, null);

                    media_queries(mq_limits[1], () => {
                        return scroll_amt = 296;
                    }, null);
    
                    media_queries(mq_limits[2], () => {
                        return scroll_amt = 360;
                    }, null);

                    media_queries(mq_limits[3], () => {
                        return scroll_amt = 656/2;
                    }, null);

                    media_queries(mq_limits[4], () => {
                        return scroll_amt = 720/2;
                    }, null);

                    media_queries(mq_limits[5], () => {
                        return scroll_amt = 980/3;
                    }, null);

                    media_queries(mq_limits[6], () => {
                        return scroll_amt = 1080/3;
                    }, null);
                };

                scroll_amt_modifier();
                window.addEventListener("resize", debounce(() => {

                    scroll_amt_modifier();
                    UI.my_carousel_content.scrollLeft = 0;
                }, 500));

                UI.my_carousel_prev_btn.addEventListener("click", throttle(function() {

                    //logger(scroll_amt);
                    UI.grow_btn_onclick(UI.my_carousel_prev_btn, 1.25, 250);
                    UI.scroll_horizontally(UI.my_carousel_content, -scroll_amt);
                    UI.scroll_end(UI.my_carousel_content, 20);
                }, 700));
    
                UI.my_carousel_next_btn.addEventListener("click", throttle(function() {

                    //logger(scroll_amt);
                    UI.grow_btn_onclick(UI.my_carousel_next_btn, 1.25, 250);
                    UI.scroll_horizontally(UI.my_carousel_content, scroll_amt);
                    UI.scroll_start(UI.my_carousel_content, 20);
                }, 700));
            })();

            /*** TOOLS & TECHNOLOGIES SECTION ***/

            /** Tag Cloud **/
            
            (function() {

                let tagcloud_radius;
                const mq_limits = [
                    window.matchMedia("(max-width: 320.98px)"),
                    window.matchMedia("(min-width: 321px) and (max-width: 575.98px)"),
                    window.matchMedia("(min-width: 576px) and (max-width: 767.98px)"),
                    window.matchMedia("(min-width: 768px) and (max-width: 991.98px)"),
                ];

                const tagcloud_resizer = function() {

                    media_queries(mq_limits[0], () => {

                        return tagcloud_radius = 140;
                    }, null); 

                    media_queries(mq_limits[1], () => {

                        return tagcloud_radius = 150;
                    }, null); 

                    media_queries(mq_limits[2], () => {

                        return tagcloud_radius = 250;
                    }, null); 

                    media_queries(mq_limits[3], () => {

                        return tagcloud_radius = 300;
                    }, null); 

                    return tagcloud_radius;
                };

                tagcloud_resizer();

                let tagCloud;

                const tagcloud_loader = function() {
                    
                    // Define tags in js array
                    let myTags = [
                        'OOP', 'SOC / MVC', 'REST-APIs',
                        'Data-Structures', 'Continuous-Integration', 'UI / UX',
                        'Testing', 'Version-Control', 'Debugging',
                        'Algorithms', 'App-Development', 'Responsive-Design', 
                        'Security', 'Optimization', 'Customer-Service',
                    ];

                    // Render a default tag cloud
                    // let tagCloud = TagCloud('.tag-cloud-content', myTags);
                    // Config tag cloud by overriding default parameters below

                    tagCloud = TagCloud('.tag-cloud-content', myTags, {

                        // radius in px
                        radius: tagcloud_radius ?? 340,

                        // animation speed
                        // slow, normal, fast
                        maxSpeed: 'fast',
                        initSpeed: 'slow',

                        // 0 = top
                        // 90 = left
                        // 135 = right-bottom
                        direction: 135,
                        
                        // interact with cursor move on mouse out
                        keep: false,
                    });

                    //console.log(tagCloud)

                    // Add more tags to existing tag cloud
                    // myTags = myTags.concat([]);
                    // tagCloud.update(myTags);

                    const tagcloud = document.querySelector(".tagcloud");
                    const tagcloud_items = document.querySelectorAll(".tagcloud--item");

                    tagcloud_items.forEach(item => {

                        item.style.color = generate_dark_color_hex(); 
                        let clicked_once = false;
                        let clicked_twice = false;

                        item.addEventListener("click", ()=>{
                            
                            if(clicked_once && clicked_twice) {

                                item.style.fontSize = "0"; 
                                setTimeout(() => {
                            
                                    item.style.color = generate_dark_color_hex(); 
                                    item.style.fontSize = "initial";
                                    item.style.fontWeight = "400";
                                    clicked_once = false; 
                                    clicked_twice = false;
                                }, 7000);
                            } else if(clicked_once && !clicked_twice) {

                                item.style.color = "var(--theme-colour-4)"; 
                                //item.style.fontSize = "1.5rem";
                                item.style.fontSize = "140%";
                                clicked_twice = true;
                            } else {

                                item.style.color = "var(--theme-colour-1)"; 
                                //item.style.fontSize = "1.3rem";
                                //item.style.fontWeight = "900";
                                item.style.fontSize = "120%";
                                clicked_once = true;
                            } 
                        }); 
                    });
                };

                // Delay loading of tag cloud
                new Promise((resolve, reject) => {

                    return setTimeout(resolve, 3100);
                })
                .then(() => import("./Business_Logic/TagCloud.min.js"))
                .then(module => module.default)
                .then(() => {
                    
                    tagcloud_loader();

                    window.addEventListener("resize", debounce(function() {

                        tagcloud_resizer();
                        if(document.querySelector(".tagcloud")) document.querySelector(".tagcloud").remove();
                        tagcloud_loader();
                    }, 800)); 
                })
                .catch((err) => console.error(err));
            })();
            
            // Display star rating for each tool / technology based on skill level 
            UI.populate_skill_rating((new Skill_Rating));

            /*** PROJECTS SECTION ***/

            // Create Projects
            (function() {

                let current_project = new Project();
                let new_inner_html = ``;

                UI.dev_project_gallery_btns.forEach(btn => {
                    
                    btn.addEventListener("click", () => {

                        logger(btn, btn.getAttribute("data-dev-project"), btn.dataset.devProject);

                        if(btn.dataset.devProject === "Wix Site Clone") {

                            current_project = Wix_Clone;
                        } else {

                            return logger("PROJECT NOT LOADED YET");
                        }

                        logger(current_project);
                        change_project();
                        UI.dev_project_overview.innerHTML = new_inner_html;
                    });
                });

                function change_project() {

                    new_inner_html = 
                        `
                            <div class="flex-row row justify-content-between align-items-center ">
                                <div class="col-12 col-xl-6">
                                    <div id="dev-project-carousel" class="carousel slide" data-bs-ride="carousel">
                                        <div class="carousel-indicators">
                                            <button type="button" data-bs-target="#dev-project-carousel" data-bs-slide-to="0" class="active btn" aria-current="true" aria-label="Slide 1"></button>
                                            <button type="button" data-bs-target="#dev-project-carousel" data-bs-slide-to="1" class="btn" aria-label="Slide 2"></button>
                                            <button type="button" data-bs-target="#dev-project-carousel" data-bs-slide-to="2" class="btn" aria-label="Slide 3"></button>
                                        </div>

                                        <div class="carousel-inner">
                                            <div class="carousel-item active" data-bs-interval="5000">
                                                <img class="d-block w-100 p-3" src=${current_project.carousel_img_list.src[0]} alt=${current_project.carousel_img_list.alt[0]}>
                                            </div>

                                            <div class="carousel-item" data-bs-interval="5000">
                                                <img class="d-block w-100 p-3" src=${current_project.carousel_img_list.src[1]} alt=${current_project.carousel_img_list.alt[1]}>
                                            </div>

                                            <div class="carousel-item" data-bs-interval="5000">
                                                <img class="d-block w-100 p-3" src=${current_project.carousel_img_list.src[2]} alt=${current_project.carousel_img_list.alt[2]}>
                                            </div>
                                        </div>

                                        <button class="carousel-control-prev btn h-50 m-auto" type="button" data-bs-target="#dev-project-carousel" data-bs-slide="prev">
                                            <span class="carousel-control-prev-icon" aria-hidden="true"></span>

                                            <span class="visually-hidden">Previous</span>
                                        </button>

                                        <button class="carousel-control-next btn h-50 m-auto" type="button" data-bs-target="#dev-project-carousel" data-bs-slide="next">
                                            <span class="carousel-control-next-icon" aria-hidden="true"></span>

                                            <span class="visually-hidden">Next</span>
                                        </button>
                                    </div>
                                </div>

                                <div class="col-12 col-xl-6">
                                    <div class="card-body py-5">
                                        <h3>${current_project.name}</h3>
                                        
                                        <p>
                                            ${current_project.description}
                                            <br><strong>Status: ${current_project.status} <span class="status-in-progress status-circle"></span></strong>
                                        </p>
                                        
                                        <a href=${current_project.link} class="fs-5 text-reset text-decoration-none anim-link-2 w-auto" target="_blank"><strong class="text-custom-2">${current_project.link_header}</strong> Now ${current_project.link_note}</a>
                                        <br><a href=${current_project.github_link} class="fs-5 text-reset text-decoration-none anim-link-2 w-auto" target="_blank"><strong class="text-custom-1">Review</strong> Code ${current_project.github_readme}</a>

                                        <h4 class="small text-left mt-3">Notes:</h4>
                                        <ul>
                                            <li>Gameplay works completely but there are some minor bugs to fix, mainly in the areas of UI/UX. Very rarely, game does not load when difficulty is selected. Simply refresh the browser and try again.</li>
                                            <li>Some features are missing such as player entered details, data persistence, settings; to be implemented at a later date.</li>
                                            <li class="text-red">Use Google Chrome for the best experience. Not yet fully responsive on smaller devices!</li>
                                        </ul>  

                                        <h3 class="small mt-3">- Built Using -</h3>

                                        <div class="icon-row-sm">
                                            <img class="img-fluid icon-disp-img" id="icon-html" src="/img/HTML5_Badge_256.png" alt="HTML5 Icon Badge" data-anijs="if: mouseout, do: flip animated, to: #icon-html, after: $removeAnim">
                                            <img class="img-fluid icon-disp-img" id="icon-css" src="/img/CSS3_Badge.png" alt="CSS3 Icon Badge" data-anijs="if: mouseout, do: flip animated, to: #icon-css, after: $removeAnim">
                                            <img class="img-fluid icon-disp-img" id="icon-js" src="/img/JavaScript-logo.png" alt="Javascript Icon Badge" data-anijs="if: mouseout, do: flip animated, to: #icon-js, after: $removeAnim">
                                        </div>
                                    </div>  
                                </div>
                            </div>
                        `
                };

                // Alien Mathvasion Project
                const Alien_Mathvasion = new Project("Alien Mathvasion Game", 2, "https://dnoelmathinvasiongame.netlify.app/html/gamescreen.html", "Play", 
                    "https://github.com/DNoel26/Alien_Mathvasion", true);

                Alien_Mathvasion.description = `This project was designed for children ages 8+ with the goal of making math fun and engaging. It was built from scratch without any frameworks, libraries or dependencies using OOP and SOC principles, and with the 
                    intention of making code DRY and easier to maintain. Utilizes heavy JavaScript and DOM manipulation. Uses promises instead of while loops to track progress. Visual design is based on retro arcade Shoot-em Up games.
                    Good luck surviving the hardest difficulty!`;
                Alien_Mathvasion.link_note = "(expect audio)";
                Alien_Mathvasion.notes.push(`Gameplay works completely but there are some minor bugs to fix, mainly in the areas of UI/UX. Very rarely, game does not load when difficulty is selected. Simply refresh the browser and try again.`);
                Alien_Mathvasion.notes.push(`Some features are missing such as player entered details, data persistence, settings; to be implemented at a later date.`);
                Alien_Mathvasion.notes.push(`Use Google Chrome for the best experience. Not yet fully responsive on smaller devices!`);
                Alien_Mathvasion.add_imgs([], [], []);
                Alien_Mathvasion.add_tool_icons(["a","b","c"], ["src1","src2","src3"], ["alt1","alt2","alt3"]);

                // Wix Clone Project
                const Wix_Clone = new Project("Wix Site Clone", 1, "https://dnoelmotorcyclewixclone.netlify.app/", "View", 
                    "https://github.com/DNoel26/Wix_Motorcycle_Trial", true);

                Wix_Clone.description = `This was my first official development project and was intended to be a pixel for pixel clone of a selected Wix site. It was built using HTML, CSS and without any JavaScript. 
                    Showcases the ability to take designs and convert them into functional webpages or websites.`;
                Wix_Clone.link_note = "(see cloned Wix site here)";
                Wix_Clone.notes.push(`Only 3 pages were cloned for this project: Home, About and Contact`);
                Wix_Clone.add_imgs([], [], []);
                Wix_Clone.add_tool_icons([], [], []);

                // Cyberdise Online Store Project
                const Cyberdise = new Project("Cyberdise Online Store", 2, "https://dnoelcyberdise.herokuapp.com/", "Interact", 
                    "https://github.com/DNoel26/Cyberdise-Dynamic-", true);
                
                Cyberdise.description = `This project was my first official Full Stack development project and end-to-end C.R.U.D. application, and was designed to test everything I had learned (and more). This online store was built from scratch using MVC principles for the Back End code.
                    The database for storing user and product info was designed for and built using MySQL, and server side communication was established using Node and Express.`;
                Cyberdise.link_note = "(create a customer account and login or see github readme to access the employee account and features)";
                Cyberdise.notes.push();
                Cyberdise.add_imgs([], [], []);
                Cyberdise.add_tool_icons([], [], []);

                // Movie Database Project
                const Movie_Database = new Project("Movie Database", 2, "https://dnoelmovieapidatabase.netlify.app/", "View", 
                    "https://github.com/DNoel26/Movie_Database", true);

                // Amazon Clone Project
                const Amazon_Clone = new Project("Amazon Clone", 2, "https://clone-905a7.web.app/", "Interact", 
                    "https://github.com/DNoel26/Amazon_React_Clone", true);

                // Real Estate Website Project
                const Real_Estate_Site = new Project("Real Estate Site", 2, "https://presidentialrealtors-dev-static.netlify.app/", "View", 
                    "https://github.com/DNoel26/Presidential-Realtors-Static", true);

                console.log(Alien_Mathvasion.tool_icon_list);
                console.log(Alien_Mathvasion.tool_icon_list.id[2]);
            })();

            /*** CONTACT SECTION ***/

            /** Formspree validation **/

            // Example starter JavaScript for disabling form submissions if there are invalid fields
            (function() {
                
                const formspree = function() {

                    // Formspree 
                    const validation_msgs = [
                        (function() {
                            return UI.display_form_validation_msg();
                        })
                    ];
                    
                    // Fetch all the forms we want to apply custom Bootstrap validation styles to using document.querySelectorAll('.needs-validation')
                    // Loop over them and prevent submission
                    Array.prototype.slice.call(UI.forms_need_validation)
                    .forEach(function(form, index) {
                        
                        form.addEventListener("submit", function(event) {
                        
                            event.preventDefault();
                            event.stopImmediatePropagation();
                            import('./Business_Logic/Formspree.js')
                            .then(module => module.default) // uses the default export
                            .then((Formspree) => {

                                if(!form.checkValidity()) {
    
                                    return new Promise((resolve,reject)=>{
                                        
                                        form.classList.add('was-validated');
                                        resolve();
                                    })
                                    .then(() => {
    
                                        // Displays validation messages if failed to enter info correctly
                                        validation_msgs[index]();
                                    })
                                    .catch((err) => {
                                        
                                        console.error(`Failed to add "was-validated" class to Bootstrap form: ${err}`);
                                    });
                                } else {
    
                                    const My_Form = new Formspree(UI.my_form);
                                    My_Form.method = UI.my_form.method;
                                    My_Form.url = UI.my_form.action;
                                    My_Form.data = new FormData(My_Form.form);
                                    My_Form.success_msg = `Hi ${My_Form.get_form_data("first_name").trim()}! ` + My_Form.success_msg;
                                    My_Form.error_msg = `Sorry ${My_Form.get_form_data("first_name").trim()}! ` + My_Form.error_msg;
    
                                    const success = wrapper_no_exec(form_submit_success, My_Form.form, UI.my_form_button, UI.my_form_status, My_Form.success_msg);
                                    const error = wrapper_no_exec(form_submit_error, UI.my_form_status, My_Form.error_msg);
                                    ajax(My_Form.method, My_Form.url, My_Form.data, success, error);
                                    
                                    recaptchaCallback(() => {
                                       
                                        console.log("in grecaptcha callback", grecaptcha);
                                        form.classList.remove('was-validated');
                                        if(UI.country_select.labels[0].children[1] && UI.country_select.labels[0].children[1].tagName === "IMG") UI.country_select.labels[0].children[1].remove();
                                    });
                                };
                            })
                            .catch(err => console.error("Failed to import module: ", err))
                        }, false);
                    });
                };

                const Country_API = new API("https://restcountries.eu/rest/v2/all");

                let user_typed = false;
                const select_change = function() {

                    const selected_options = document.querySelectorAll("option");
                    selected_options.forEach(option => {
                        
                        if((option.value && option.selected) && option.value !== "") {

                            const flag = option.getAttribute("data-flag");
                            const calling_codes = option.getAttribute("data-calling-codes");
                            const img = document.createElement("img");
                            img.setAttribute("src", flag);
                            img.setAttribute("alt", `Country flag for ${option.value}`);
                            img.setAttribute("width", "40px");
                            img.setAttribute("height", "auto"); 

                            if(!user_typed) UI.phone.value = `+${calling_codes}-`;
                            if(UI.country_select.labels[0].children[1] && UI.country_select.labels[0].children[1].tagName === "IMG") UI.country_select.labels[0].children[1].remove();

                            UI.country_select.labels[0].appendChild(img);
                        } else if(option.selected && !option.value) {

                            if(UI.country_select.labels[0].children[1] && UI.country_select.labels[0].children[1].tagName === "IMG") UI.country_select.labels[0].children[1].remove();
                        };
                    });
                };

                Country_API.fetch_api()
                .then((data) => {

                    //logger(data);
                    data.forEach(datum => {
                        
                        const new_option = document.createElement("option");
                        new_option.setAttribute("value", datum.name);
                        new_option.setAttribute("data-flag", datum.flag);
                        new_option.setAttribute("data-calling-codes", datum.callingCodes);
                        new_option.innerHTML = new_option.value;
                        UI.country_select.appendChild(new_option);
                    });

                    UI.phone.addEventListener("keyup", debounce(() => {

                        user_typed = true;
                    }, 500));

                    UI.country_select.addEventListener("change", debounce(() => {

                        select_change();
                    }, 300));
                })
                .catch(err => console.error("Error: ", err))
                .then(() => formspree());    
            })();

        }); // end of DOMContentLoaded event listener
    }, // end of init()
}; // end of App

App.init();



