'use strict';

console.log("App.js Loaded Successfully");

import UI from "./UI_Logic/UI.js";
import { logger, calculate_age, wrapper_exec, wrapper_no_exec, debounce, throttle, scroll_progress,
    generate_dark_color_hex, form_submit_success, form_submit_error, ajax, media_queries} from "./Business_Logic/Functions.js";
import Skill_Rating from "./Business_Logic/SkillRating.js";
import Project from "./Business_Logic/Project.js";
import Formspree from "./Business_Logic/Formspree.js";
// import "./Business_Logic/TagCloud.min.js";

const App = {
    init() {

        /*** Main Document ***/

        document.addEventListener("DOMContentLoaded", ()=>{
            
            console.log("DOMContentLoaded Successfully");

            /*** GENERAL ***/

            UI.body.classList.add("will-change-height");
            
            // Delay load of non-essential scripts
            setTimeout(() => {
                
                UI.create_script("https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js");
            }, 1000);

            const ext_script_load = new Promise((resolve, reject) => {

                UI.create_script("./js/Business_Logic/TagCloud.min.js", "https://code.tidio.co/edv8badlavwvekyo42tfkxyp6frut7yq.js", "https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js");

                setTimeout(resolve, 3000);
            });

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

            let scroll_moved = false;
            let header_vid_ended = false;

            /*const x = window.matchMedia("(max-width: 991.98px");
            media_queries(x, function() {
                this.nav_container.style.height = "35vh";    
            });*/
                
            UI.toggler_btn.addEventListener("click", () => {

                const x = window.matchMedia("(min-width: 768px) and (max-width: 991.98px)");

                if(!UI.toggler_btn.classList.contains("collapsed")) {

                    UI.toggler_menu_reveal();
                } else {
                    
                    UI.toggler_menu_hide();
                };
            });

            if(document.documentElement.scrollTop > 2 || window.pageYOffset > 2) {

                UI.shrink_header();
                UI.expand_placeholder_div();
                scroll_moved = true;
            } else {
                
                UI.expand_header();
                UI.shrink_placeholder_div();
                scroll_moved = false;
            };

            // Removes video after playing once and then adds a static background image (refresh to play video again)
            UI.header_vid.addEventListener("ended", ()=>{

                UI.replace_vid_bg();
                UI.header_vid.remove();
                header_vid_ended = true;
            })

            //document.addEventListener('scroll', debounce(logger, 1000));

            document.addEventListener("scroll", debounce(function() {

                // Calls horizontal progress bar indicator function on scroll
                scroll_progress(UI.scroll_indicator);
            }, 300));

            document.addEventListener("scroll", debounce(function() {

                scroll_moved = false;
            }, 800));

            document.addEventListener("scroll", throttle(function() {

                console.log("throttling", scroll_moved);
                //UI.nav_container.style.height = UI.header.offsetHeight;

                // Resize header when scrolling - adds artificial height to compensate for reduction in header height and aid in smooth transitioning
                if((document.documentElement.scrollTop > 0 || window.pageYOffset > 0) && scroll_moved === false) {

                    
                    UI.shrink_header();
                    UI.expand_placeholder_div();
                    scroll_moved = true;
                } else if((document.documentElement.scrollTop <= 0 || window.pageYOffset <= 0) && scroll_moved === true) {

                    //UI.nav_container.style.overflow = "hidden";
                    //UI.nav_container.style.height = 0;
                    UI.expand_header();
                    UI.shrink_placeholder_div(); 
                    
                    if(scroll_moved && header_vid_ended) {

                        UI.replace_vid_bg();
                    };

                    scroll_moved = false;
                    document.documentElement.scrollTop = 0;
                };
            }, 100));

            document.addEventListener("scroll", ()=>{

                //Add active-list class to active link to work with CSS ::before and ::after settings (does not work well with animations for dropdown when active is set to the link itself)
                UI.active_lists.forEach(li => {
                        
                    if(li.children[0].classList.contains("active")) {
  
                        li.classList.add("active-list");
                    } else {

                        li.classList.remove("active-list"); 
                    };
                });
            });

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
                    });

                    media_queries(mq_limits[1], () => {
                        return scroll_amt = 296;
                    });
    
                    media_queries(mq_limits[2], () => {
                        return scroll_amt = 360;
                    });

                    media_queries(mq_limits[3], () => {
                        return scroll_amt = 580;
                    });

                    media_queries(mq_limits[4], () => {
                        return scroll_amt = 580;
                    });
                };

                scroll_amt_modifier();

                UI.my_carousel_prev_btn.addEventListener("click", throttle(function() {

                    logger(scroll_amt);
                    UI.grow_btn_onclick(UI.my_carousel_prev_btn, 1.25, 250);
                    UI.scroll_horizontally(UI.my_carousel_content, -scroll_amt);
                    UI.scroll_end(UI.my_carousel_content, 20);
                }, 700));
    
                UI.my_carousel_next_btn.addEventListener("click", throttle(function() {

                    logger(scroll_amt);
                    UI.grow_btn_onclick(UI.my_carousel_next_btn, 1.25, 250);
                    UI.scroll_horizontally(UI.my_carousel_content, scroll_amt);
                    UI.scroll_start(UI.my_carousel_content, 20);
                }, 700));
            })();

            /*** TOOLS & TECHNOLOGIES SECTION ***/

            /** Tag Cloud **/
            
            let tagcloud_radius;

            // Delay loading of tag cloud
            ext_script_load
            .then(() => {

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

                const tagCloud = TagCloud('.tag-cloud-content', myTags, {

                    // radius in px
                    radius: tagcloud_radius ?? 320,

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
                                item.style.fontSize = "1.2rem";
                                item.style.fontWeight = "600";
                                clicked_once = false; 
                                clicked_twice = false;
                            }, 5000);
                        } else if(clicked_once && !clicked_twice) {

                            item.style.color = "var(--theme-colour-4)"; 
                            item.style.fontSize = "1.5rem";
                            clicked_twice = true;
                        } else {

                            item.style.color = "var(--theme-colour-1)"; 
                            item.style.fontSize = "1.3rem";
                            item.style.fontWeight = "900";
                            clicked_once = true;
                        } 
                    }); 
                });
            })
            .catch(err => logger(err));
            
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
                        };

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
                
                const validation_msgs = [UI.display_form_validation_msg];
                
                // Fetch all the forms we want to apply custom Bootstrap validation styles to using document.querySelectorAll('.needs-validation')
                // Loop over them and prevent submission
                Array.prototype.slice.call(UI.forms_need_validation)
                .forEach(function(form, index) {
                    
                    form.addEventListener("submit", function(event) {
                    
                        event.preventDefault();
                        console.log(UI.my_form.children);

                        if(!form.checkValidity()) {
                            
                            event.stopPropagation();

                            return new Promise((resolve,reject)=>{
                                
                                form.classList.add('was-validated');
                                resolve();
                            })
                            .then(()=>{

                                // Displays validation messages if failed to enter info correctly
                                validation_msgs[index]();
                            })
                            .catch((err) => {
                                
                                console.log(`Failed to add "was-validated" class to Bootstrap form: ${err}`);
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

                            // Google recaptcha data function (function name must be same as data-callback attribute value)
                            function recaptchaCallback() {

                                console.log("grecaptcha checked");
                                form.classList.remove('was-validated');
                            };

                            recaptchaCallback();
                        };
                    }, false);
                });
            })();

        }); // end of DOMContentLoaded event listener
    }, // end of init()
}; // end of App

App.init();



