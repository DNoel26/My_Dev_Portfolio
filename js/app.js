'use strict';

console.log("App.js Loaded Successfully");

import UI from "./UI_Logic/UI.js";
import { logger, calculate_age, wrapper_exec, wrapper_no_exec, debounce, throttle, scroll_progress,
    generate_dark_color_hex, form_submit_success, form_submit_error, ajax, media_queries} from "./Business_Logic/Functions.js";
import Skill_Rating from "./Business_Logic/SkillRating.js";
import Project from "./Business_Logic/Project.js";
//import Formspree from "./Business_Logic/Formspree.js";
import API from "./Business_Logic/API.js"

// Google recaptcha data function (function name must be same as data-callback attribute value)
function recaptchaCallback(func) {
                
    console.log("In recaptcha");
    return func();
};

const App = {
    init() {

        /*** Main Document ***/

        document.addEventListener("DOMContentLoaded", ()=>{
            
            console.log("DOMContentLoaded Successfully");

            /*** GENERAL ***/

            UI.body.classList.add("will-change-height");
            UI.header.classList.add("will-change-height");
            UI.my_form_button.setAttribute("disabled", "disabled");

            // Load BG video from selection
            UI.load_bg_vid();
            
            // Delay load of non-essential scripts
            setTimeout(() => {

                media_queries(window.matchMedia("(min-width: 768px)"), () => {

                    return UI.create_scripts("https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js");
                }, () => {return})
            }, 2000);

            setTimeout(() => {
                
                return UI.create_scripts("https://code.tidio.co/edv8badlavwvekyo42tfkxyp6frut7yq.js", "https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js");
            }, 10000);

            const script_delay = new Promise((resolve, reject) => {

                UI.create_scripts("https://www.google.com/recaptcha/api.js?render=explicit");
                setTimeout(resolve, 5000);
            })
            .then(() => {

                // Checks to see if recaptcha has loaded correctly and *if not, makes up to 10 attempts to reload*
                recaptchaCallback(() => {

                    if(UI.grecaptcha.length > 0) {

                        UI.my_form_button.removeAttribute("disabled");
                        console.log(grecaptcha);
                        grecaptcha.render("recaptcha", {

                            sitekey: "6LfWHkgaAAAAAIKEcuqTQiy82YSpeWTdjebsfWZ3",
                            callback: () => {

                                return;
                            },
                        });
                    };
                });
            })
            .catch(err => console.log("Error in script delay promise: ", err)) 

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

            let show_header = true;
            let scroll_limit = 0;
            let scroll_moved = false;
            let scroll_top_reset = true;
            let scroll_timer;
            let header_vid_ended = false;

            // Controls the side menu (tablet) and mobile menu functions 
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
                        
            // Removes poster or bg if video fails to load and then adds a static background image
            UI.header_vid.addEventListener("animationend", ()=>{

                setTimeout(() => {

                    UI.replace_vid_bg();
                    UI.header_vid.remove();
                    header_vid_ended = true;
                }, 3000);
            }); 

            // Controls the Scroll Events
            (function() {

                const header_transform = function() {

                    // Resize header when scrolling - adds artificial height to compensate for reduction in header height and aid in smooth transitioning
                    if((document.documentElement.scrollTop > scroll_limit || window.pageYOffset > scroll_limit) && scroll_moved === false) {
                    
                        UI.shrink_header();
                        UI.expand_placeholder_div();
                        scroll_moved = true;
                    } else if((document.documentElement.scrollTop <= scroll_limit || window.pageYOffset <= scroll_limit) && scroll_moved === true) {
                        
                        UI.expand_header();
                        UI.shrink_placeholder_div();

                        if(scroll_moved && header_vid_ended) {
    
                            UI.replace_vid_bg();
                        };

                        scroll_moved = false;
                        scroll_top_reset = true;
                    } else if((document.documentElement.scrollTop > scroll_limit || window.pageYOffset > scroll_limit) && scroll_moved === true) {

                        return;
                    }
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

                // Adjusts header to match screen size if resized
                window.addEventListener("resize", debounce(() => {

                    header_transform();
                }, 200));

                // Sets the timer for the header hide/show function (timer to be cleared on window scroll or element hover)
                const header_timer = function() {

                    return (scroll_timer = setTimeout(() => {
                            
                        //is_scrolling = false;
                        
                        if(!show_header) {

                            UI.header.style.opacity = "0";
                            UI.header.style.visibility = "hidden";
                        };
                    }, 510));
                };

                // Stops the header timer when mouse hovers over the header
                UI.header.addEventListener("mouseover", () => {

                    show_header = true;
                    clearTimeout(scroll_timer);
                });

                // Stops the header timer when mouse moves over the header
                UI.header.addEventListener("mousemove", () => {

                    show_header = true;
                    clearTimeout(scroll_timer);
                });

                // Stops the header timer when screen is touched on the header
                UI.header.addEventListener("touchstart", () => {

                    show_header = true;
                    clearTimeout(scroll_timer);
                }, {passive: true});

                // Stops the header timer when screen is moved on the header
                UI.header.addEventListener("touchmove", () => {

                    show_header = true;
                    clearTimeout(scroll_timer);
                }, {passive: true});

                // Resumes header timer to hide header when mouse leaves the element
                UI.header.addEventListener("mouseout", () => {

                    if((document.documentElement.scrollTop > scroll_limit || window.pageYOffset > scroll_limit)) {

                        show_header = false;
                        header_timer();
                    };
                });

                // Stops the header timer when mouse moves over the header
                UI.header_btns.forEach(btn => {
                    
                    btn.addEventListener("focus", () => {

                        show_header = true;
                        clearTimeout(scroll_timer);
                    });
                });

                //Hides header on scroll and returns to normal position when stopped after a few seconds
                document.addEventListener("scroll", throttle(() => {

                    if(document.documentElement.scrollTop > scroll_limit || window.pageYOffset > scroll_limit) show_header = false;
                    else show_header = true;

                    // Hides the header on scroll stop or shows while scrolling or hovering on element (debounces while scrolling)
                    if(!show_header) {

                        if(UI.bot_nav_collapse.classList.contains("show")) {

                            clearTimeout(scroll_timer);
                            show_header = true;
                            return;
                        };

                        // Clear previous timer and reset
                        clearTimeout(scroll_timer);
                        UI.header.style.opacity = "unset";
                        UI.header.style.visibility = "unset";
                        header_timer();
                    } else {

                        clearTimeout(scroll_timer);
                        UI.header.style.opacity = "unset";
                        UI.header.style.visibility = "unset";
                        return;
                    };
                }, 100), {passive: true});

                document.addEventListener("scroll", debounce(() => {

                    scroll_progress(UI.scroll_indicator);
                }, 100), {passive: true});

                document.addEventListener("scroll", scroll_moved_debounce_wrapper,  {passive: true});
                document.addEventListener("touchmove", scroll_moved_debounce_wrapper,  {passive: true});
                document.addEventListener("touchstart", scroll_moved_debounce_wrapper,  {passive: true});

                document.addEventListener("scroll", sticky_header_throttle_wrapper,  {passive: true});
                document.addEventListener("touchmove", sticky_header_throttle_wrapper,  {passive: true});
                document.addEventListener("touchstart", sticky_header_throttle_wrapper,  {passive: true});
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

            // Changes carousel horizontal scroll amount depending on the screen size
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
                    window.matchMedia("(min-width: 992px)")
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

                    media_queries(mq_limits[4], () => {

                        return tagcloud_radius = undefined;
                    }, null); 
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

                    // Randomizes tag word colours and adds effects on click
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
                                }, 5000);
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

                    // Resets and resizes tag cloud for different screen sizes
                    window.addEventListener("resize", debounce(function() {

                        tagcloud_resizer();
                        if(document.querySelector(".tagcloud")) document.querySelector(".tagcloud").remove();
                        tagcloud_loader();
                    }, 500)); 
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
                const dev_project_carousel = new bootstrap.Carousel(UI.dev_project_carousel, {
                    
                    interval: 5000,
                });

                // Adds an indicator button, along with attributes per image and sets active class to first slide
                // Accepts a single parameter with values "dev" or "client"
                function populate_carousel_indicators(proj_type) {

                    current_project.carousel_img_list.srcs.forEach((indicator, index) => {
                        
                        const btn = document.createElement("button");
                        btn.setAttribute("type", "button");
                        btn.setAttribute("data-bs-target", "#dev-project-carousel");
                        if(index === 0) btn.classList.add("active", "btn"), btn.setAttribute("aria-current", "true");
                        else btn.classList.add("btn");
                        btn.setAttribute("aria-label", `Slide ${index+1}`);

                        // Append to dev or client project depending on parameter set
                        if(proj_type === "dev".toLowerCase()) UI.dev_project_carousel_indicator_section.appendChild(btn);
                        else if(proj_type === "client".toLowerCase()) UI.dev_project_carousel_indicator_section.appendChild(btn);
                    });
                };

                // Adds each image along with attributes, to the carousel slideshow
                // Accepts a single parameter with values "dev" or "client"
                function populate_carousel_img_data(proj_type) {

                    current_project.carousel_img_list.srcs.forEach((src, index) => {
                        
                        const div = document.createElement("div");
                        if(index === 0) div.classList.add("carousel-item", "active");
                        else div.classList.add("carousel-item");
                        const img = document.createElement("img");
                        img.setAttribute("loading", "lazy");
                        img.classList.add("d-block", "w-100", "p-3");
                        img.setAttribute("src", src);
                        img.setAttribute("alt", (current_project.carousel_img_list.alts[index] || "My project carousel image"));
                        img.setAttribute("width", "625");
                        img.setAttribute("height", "500");
                        div.appendChild(img);

                        // Append to dev or client project depending on parameter set
                        if(proj_type === "dev".toLowerCase()) UI.dev_project_carousel_inner_section.appendChild(div);
                        else if(proj_type === "client".toLowerCase()) UI.client_project_carousel_inner_section.appendChild(div);
                    });
                };

                // Adds notes to project overview
                // Accepts a single parameter with values "dev" or "client"
                function populate_project_notes(proj_type) {

                    current_project.notes.forEach((note, index) => {
                        
                        const list = document.createElement("li");
                        list.innerHTML = note;
                        if(index === current_project.notes.length - 1) list.classList.add("fw-bold");

                        // Append to dev or client project depending on parameter set
                        if(proj_type === "dev".toLowerCase()) UI.dev_project_carousel_note_section.appendChild(list);
                        else if(proj_type === "client".toLowerCase()) UI.client_project_carousel_note_section.appendChild(list);
                    });
                };

                // Adds each tool / technology icon to the end of the project overview
                // Accepts a single parameter with values "dev" or "client"
                function populate_project_tool_icons(proj_type) {

                    current_project.tool_icon_list.srcs.forEach((src, index) => {
                        
                        const img = document.createElement("img");
                        img.setAttribute("loading", "lazy");
                        img.classList.add("img-fluid", "icon-disp-img-lg", "m-3");
                        img.id = current_project.tool_icon_list.ids[index] || null;
                        img.setAttribute("src", src);
                        img.setAttribute("alt", (current_project.tool_icon_list.alts[index] || "Tool and Technology Icon Badge"));
                        img.setAttribute("width", "85");
                        img.setAttribute("height", "64");

                        // Append to dev or client project depending on parameter set
                        if(proj_type === "dev".toLowerCase()) UI.dev_project_carousel_icon_section.appendChild(img);
                        else if(proj_type === "client".toLowerCase()) UI.client_project_carousel_icon_section.appendChild(img);
                    });
                };

                function change_project() {

                    new_inner_html = `
                        <div class="flex-row row justify-content-between align-items-center">
                            <div class="col-12 col-xl-6">
                                <div id="dev-project-carousel" class="carousel slide" data-bs-ride="carousel">
                                    <div class="carousel-indicators" id="dev-project-carousel-indicators">
                                        
                                    </div>

                                    <div class="carousel-inner" id="dev-project-carousel-inner">

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

                                <button class="btn btn-custom-2 my-5 d-block mx-auto w-auto btn-anim" data-id="dev-project-gallery">
                                    <span class="circle" aria-hidden="true">
                                        <i class="fas fa-arrow-alt-circle-up"></i>
                                    </span>

                                    <span class="btn-text">
                                        Return to Gallery
                                    </span>
                                </button>
                            </div>

                            <div class="col-12 col-xl-6">
                                <div class="card-body py-5">
                                    <h3 class="text-center">${current_project.name}</h3>
                                    
                                    <p>
                                        ${current_project.description}
                                        <br><strong>Status: ${current_project.status.msg} <span class="${current_project.status.class_code} status-circle"></span></strong>
                                    </p>
                                    
                                    <a href=${current_project.link} class="fs-5 text-reset text-decoration-none anim-link-2 w-auto" target="_blank" rel="noopener"><strong class="text-custom-2"><i class="fas fa-external-link-alt"></i> ${current_project.link_header}</strong> Now ${current_project.link_note}</a>
                                    <br><a href=${current_project.github_link} class="fs-5 text-reset text-decoration-none anim-link-2 w-auto" target="_blank" rel="noopener"><strong class="text-custom-1"><i class="fas fa-external-link-alt"></i> Review</strong> Code ${current_project.github_readme}</a>

                                    <h4 class="small text-left mt-3">Notes:</h4>
                                    <ul class="text-wrap" id="dev-project-carousel-notes">
                                        
                                    </ul>  

                                    <h3 class="small mt-3">- Built Using -</h3>

                                    <div class="icon-row-sm mb-3" id="dev-project-carousel-icon-section">
                                        
                                    </div>
                                </div>  

                                <button class="btn btn-custom-2 my-5 d-block mx-auto w-auto btn-anim d-lg-none" data-id="dev-project-gallery">
                                    <span class="circle" aria-hidden="true">
                                        <i class="fas fa-arrow-alt-circle-up"></i>
                                    </span>

                                    <span class="btn-text">
                                        Return to Gallery
                                    </span>
                                </button>
                            </div>
                        </div>
                    `
                };

                // Alien Mathvasion Project
                const Alien_Mathvasion = new Project("Alien Mathvasion Game", 2, "https://dnoelmathinvasiongame.netlify.app/html/gamescreen.html", "Play", 
                    "https://github.com/DNoel26/Alien_Mathvasion", true);
                Alien_Mathvasion.description = `This project was designed for children ages 8+ with the goal of making math fun and engaging. It was built from scratch without any frameworks, libraries or dependencies using OOP and SOC principles, and with the 
                    intention of making code DRY and easier to maintain. Utilizes heavy JavaScript and DOM manipulation. Uses promises instead of while loops to track progress. Visual design is based on retro arcade Shoot-em Up games.
                    Good luck surviving the hardest difficulty!
                `;
                Alien_Mathvasion.link_note = "(expect audio)";
                Alien_Mathvasion.notes.push(`Gameplay works completely but there are some minor bugs to fix, mainly in the areas of UI/UX. Very rarely, game does not load when difficulty is selected. Simply refresh the browser and try again.`);
                Alien_Mathvasion.notes.push(`Some features are missing such as player entered details, data persistence, settings; to be implemented at a later date.`);
                Alien_Mathvasion.notes.push(`Use Google Chrome for the best experience. Not yet fully responsive on smaller devices!`);
                const alien_m_carousel_img_ids = [];
                const alien_m_carousel_img_srcs = ["/img/projects/webp/min/alien-mathvasion-1-min.webp", "/img/projects/webp/min/alien-mathvasion-2-min.webp", "/img/projects/webp/min/alien-mathvasion-3-min.webp"];
                const alien_m_carousel_img_alts = [];
                const alien_m_tool_img_ids = [];
                const alien_m_tool_img_srcs = ["/img/logos/html5-badge.svg", "/img/logos/css3-badge.svg", "/img/logos/javascript-badge.svg"];
                const alien_m_tool_img_alts = [];
                Alien_Mathvasion.add_imgs(alien_m_carousel_img_ids, alien_m_carousel_img_srcs, alien_m_carousel_img_alts);
                Alien_Mathvasion.add_tool_icons(alien_m_tool_img_ids, alien_m_tool_img_srcs, alien_m_tool_img_alts);

                // Wix Clone Project
                const Wix_Clone = new Project("Wix Site Clone", 1, "https://dnoelmotorcyclewixclone.netlify.app/", "View", 
                    "https://github.com/DNoel26/Wix_Motorcycle_Trial", true);
                Wix_Clone.description = `This was my first official development project and was intended to be a pixel for pixel clone of
                    <a target="_blank" class="text-reset text-decoration-none anim-link-3" rel="noopener" href="https://www.wix.com/website-template/view/html/773?siteId=32647d89-1460-4326-b084-a958bf90765d&metaSiteId=129904ad-3051-8c87-f69f-31ce75166f9c&originUrl=https%3A%2F%2Fwww.wix.com%2Fwebsite%2Ftemplates%3Fcriteria%3Dauto&tpClick=view_button">a selected, original Wix site</a>. 
                    It was built using HTML, CSS and without any JavaScript. 
                    Showcases the ability to take a design and convert it into a functional webpage or website.
                `;
                Wix_Clone.link_note = "(see link to cloned Wix site above)";
                Wix_Clone.notes.push(`Only 3 pages were cloned for this project: Home, About and Contact.`);
                Wix_Clone.notes.push(`Website is fully responsive for all devices!`);
                const wix_c_carousel_img_ids = [];
                const wix_c_carousel_img_srcs = ["/img/projects/webp/min/wix-clone-1-min.webp", "/img/projects/webp/min/wix-clone-2-min.webp", "/img/projects/webp/min/wix-clone-3-min.webp"];
                const wix_c_carousel_img_alts = [];
                const wix_c_tool_img_ids = [];
                const wix_c_tool_img_srcs = ["/img/logos/html5-badge.svg", "/img/logos/css3-badge.svg"];
                const wix_c_tool_img_alts = [];
                Wix_Clone.add_imgs(wix_c_carousel_img_ids, wix_c_carousel_img_srcs, wix_c_carousel_img_alts);
                Wix_Clone.add_tool_icons(wix_c_tool_img_ids, wix_c_tool_img_srcs, wix_c_tool_img_alts);

                // Cyberdise Online Store Project
                const Cyberdise = new Project("Cyberdise Online Store", 2, "https://dnoelcyberdise.herokuapp.com/", "Interact", 
                    "https://github.com/DNoel26/Cyberdise-Dynamic-", true);
                Cyberdise.description = `This project was my first official Full Stack development project and end-to-end C.R.U.D. application, and was designed to test everything I had learned (and more). This online store was built from scratch using MVC principles for the Back End code.
                    The database was designed, normalized and created in MySQL. There are both customer and employee functionalities to experiment with. Features such as 
                    authorization, authentication, page protection, session storage, pagination, multiple queries per database call, database transactions, product tracking, product restocking, add to cart, payment processing using a modified PayPal SDK, to name a few, were all built from the ground up and implemented in this site.
                    Check it out and let me know what you think! Please use only FAKE CREDENTIALS if creating a customer account to login. See my GitHub readme for instructions on how to log in as an employee to stock, re-stock and/or modify product data etc. 
                `;
                Cyberdise.link_note = "(fake credentials only)";
                Cyberdise.notes.push(`Most other major features are working as expected. Search functionality not implemented just yet.`);
                Cyberdise.notes.push(`Some UI elements are incomplete/missing.`);
                Cyberdise.notes.push(`Not yet fully responsive on smaller devices!`);
                const cyberdise_carousel_img_ids = [];
                const cyberdise_carousel_img_srcs = ["/img/projects/webp/min/cyberdise-online-store-1-min.webp", "/img/projects/webp/min/cyberdise-online-store-2-min.webp", "/img/projects/webp/min/cyberdise-online-store-3-min.webp", 
                    "/img/projects/webp/min/cyberdise-online-store-4-min.webp", "/img/projects/webp/min/cyberdise-online-store-5-min.webp"
                ];
                const cyberdise_carousel_img_alts = [];
                const cyberdise_tool_img_ids = [];
                const cyberdise_tool_img_srcs = ["/img/logos/html5-badge.svg", "/img/logos/css3-badge.svg", "/img/logos/javascript-badge.svg", "/img/logos/handlebars-badge.svg",
                    "/img/logos/mysql-badge.svg", "/img/logos/nodejs-badge.svg", "/img/logos/express-logo.svg", "/img/logos/postman-badge.svg"];
                const cyberdise_tool_img_alts = [];
                Cyberdise.add_imgs(cyberdise_carousel_img_ids, cyberdise_carousel_img_srcs, cyberdise_carousel_img_alts);
                Cyberdise.add_tool_icons(cyberdise_tool_img_ids, cyberdise_tool_img_srcs, cyberdise_tool_img_alts);

                // Movie Database Project
                const Movie_Database = new Project("Movie Database", 2, "https://dnoelmovieapidatabase.netlify.app/", "View", 
                    "https://github.com/DNoel26/Movie_Database", true);
                Movie_Database.description = `
                    This project was built from scratch to dynamically display "Now Showing" movie details and trailers via consuming multiple APIs; meaning all data shown on my website is requested
                    and pulled from another server, and manipulated on my website using JavaScript. Design is based on retro theatres. Click the link and take a look at all the trending movies now!
                `;
                Movie_Database.link_note = "";
                Movie_Database.notes.push(`All major features are working as expected. Pagination to be implemented.`);
                Movie_Database.notes.push(`Not yet fully responsive on smaller devices!`);
                const movie_db_carousel_img_ids = [];
                const movie_db_carousel_img_srcs = ["/img/projects/webp/min/movie-db-1-min.webp", "/img/projects/webp/min/movie-db-2-min.webp", "/img/projects/webp/min/movie-db-3-min.webp"];
                const movie_db_carousel_img_alts = [];
                const movie_db_tools_img_ids = [];
                const movie_db_tools_img_srcs = ["/img/logos/html5-badge.svg", "/img/logos/css3-badge.svg", "/img/logos/javascript-badge.svg"];
                const movie_db_tools_img_alts = [];
                Movie_Database.add_imgs(movie_db_carousel_img_ids, movie_db_carousel_img_srcs, movie_db_carousel_img_alts);
                Movie_Database.add_tool_icons(movie_db_tools_img_ids, movie_db_tools_img_srcs, movie_db_tools_img_alts);

                // Amazon Clone Project
                const Amazon_Clone = new Project("Amazon Clone", 2, "https://clone-905a7.web.app/", "Interact", 
                    "https://github.com/DNoel26/Amazon_React_Clone", true);
                Amazon_Clone.description = `
                    This project was done as my hands on introduction to React and Firebase. In this particular case, I followed a tutorial and manipulated my code rather than building from scratch.
                    The main purpose was to understand the concepts behind the very popular React framework, as well as to learn new methods for coding. Main project features are account creation, 
                    login, add to cart, and payment processing using Stripe API. Please use only FAKE CREDENTIALS if creating an account to login. See my GitHub readme for further instructions. 
                `;
                Amazon_Clone.link_note = "(fake credentials only)";
                Amazon_Clone.notes.push(`All major features are working as expected.`);
                Amazon_Clone.notes.push(`Not yet fully responsive on smaller devices!`);
                const amazon_c_carousel_img_ids = [];
                const amazon_c_carousel_img_srcs = [
                    "/img/projects/webp/min/amazon-clone-1-min.webp", "/img/projects/webp/min/amazon-clone-2-min.webp", "/img/projects/webp/min/amazon-clone-3-min.webp",
                    "/img/projects/webp/min/amazon-clone-4-min.webp"
                ];
                const amazon_c_carousel_img_alts = [];
                const amazon_c_tool_img_ids = [];
                const amazon_c_tool_img_srcs = ["/img/logos/html5-badge.svg", "/img/logos/css3-badge.svg", "/img/logos/javascript-badge.svg", "/img/logos/react-badge.svg",
                    "/img/logos/firebase-badge.svg", "/img/logos/nodejs-badge.svg", "/img/logos/express-logo.svg"
                ];
                const amazon_c_tool_img_alts = [];
                Amazon_Clone.add_imgs(amazon_c_carousel_img_ids, amazon_c_carousel_img_srcs, amazon_c_carousel_img_alts);
                Amazon_Clone.add_tool_icons(amazon_c_tool_img_ids, amazon_c_tool_img_srcs, amazon_c_tool_img_alts);

                // Real Estate Website Project
                const Real_Estate_Site = new Project("Real Estate Site", 3, "https://presidentialrealtors-dev-static.netlify.app/", "View", 
                    "https://github.com/DNoel26/Presidential-Realtors-Static", true);
                Real_Estate_Site.description = `
                    The focus of this project was for me to learn and implement modern design, user interface (UI) and user experience (UX) elements. It was built from scratch and will eventually be converted
                    to a fully functional single page application (SPA) using React, MongoDB and Next.js. Let me know what you think!
                `;
                Real_Estate_Site.link_note = "";
                Real_Estate_Site.notes.push(`Most client side features work as expected. Focus of this project was on design elements rather than functionality.`);
                Real_Estate_Site.notes.push(`Project to be redone as an app (SPA) with the the functionalities expected of a real estate website.`);
                Real_Estate_Site.notes.push(`Not yet fully responsive on smaller devices!`);
                const real_estate_carousel_img_ids = [];
                const real_estate_carousel_img_srcs = ["/img/projects/webp/min/real-estate-1-min.webp", "/img/projects/webp/min/real-estate-2-min.webp", "/img/projects/webp/min/real-estate-3-min.webp"];
                const real_estate_carousel_img_alts = [];
                const real_estate_tool_img_ids = [];
                const real_estate_tool_img_srcs = ["/img/logos/html5-badge.svg", "/img/logos/css3-badge.svg"];
                const real_estate_tool_img_alts = [];
                Real_Estate_Site.add_imgs(real_estate_carousel_img_ids, real_estate_carousel_img_srcs, real_estate_carousel_img_alts);
                Real_Estate_Site.add_tool_icons(real_estate_tool_img_ids, real_estate_tool_img_srcs, real_estate_tool_img_alts);

                //console.log(Alien_Mathvasion.tool_icon_list);
                //console.log(Alien_Mathvasion.tool_icon_list.ids[2]);

                UI.dev_project_gallery_btns.forEach(btn => {
                    
                    btn.addEventListener("click", () => {

                        logger(btn, btn.getAttribute("data-dev-project"), btn.dataset.devProject);

                        if(btn.dataset.devProject === "Alien Mathvasion Game") {

                            current_project = Alien_Mathvasion;
                        } else if(btn.dataset.devProject === "Wix Site Clone") {

                            current_project = Wix_Clone;
                        } else if(btn.dataset.devProject === "Cyberdise Online Store") {

                            current_project = Cyberdise;
                        } else if(btn.dataset.devProject === "Movie Database") {

                            current_project = Movie_Database;
                        } else if(btn.dataset.devProject === "Amazon Clone") {

                            current_project = Amazon_Clone;
                        } else if(btn.dataset.devProject === "Real Estate Site") {

                            current_project = Real_Estate_Site;
                        } else {

                            return logger("PROJECT NOT LOADED YET");
                        }

                        // Adds new project to carousel container
                        logger(current_project);
                        change_project();
                        console.log("old indicators", UI.dev_project_carousel_indicator_section, "old inner", UI.dev_project_carousel_inner_section);
                        UI.dev_project_overview.innerHTML = new_inner_html;

                        // Re-declare (update) document IDs on new inner html
                        UI.return_to_dev_gallery_btns = document.querySelectorAll("[data-id='dev-project-gallery']");
                        UI.dev_project_carousel = document.getElementById("dev-project-carousel");
                        UI.dev_project_carousel_indicator_section = document.getElementById("dev-project-carousel-indicators");
                        UI.dev_project_carousel_inner_section = document.getElementById("dev-project-carousel-inner");
                        UI.dev_project_carousel_note_section = document.getElementById("dev-project-carousel-notes");
                        UI.dev_project_carousel_icon_section = document.getElementById("dev-project-carousel-icon-section");
                        populate_carousel_img_data("dev");
                        populate_carousel_indicators("dev");
                        populate_project_notes("dev");
                        populate_project_tool_icons("dev");
                        console.log("new indicators", UI.dev_project_carousel_indicator_section, "new inner", UI.dev_project_carousel_inner_section);
                        //dev_project_carousel;
                        dispatchEvent(new Event('load'));
                        UI.dev_project_overview.scrollIntoView();

                        UI.return_to_dev_gallery_btns.forEach(btn => {

                            btn.addEventListener("click", () => {
        
                                UI.dev_project_gallery.scrollIntoView();
                            });
                        });
                    });
                });

                // Executes function and provides closure for development projects
                (function() {

                    // Select the node that will be observed for mutations
                    const target_node = UI.dev_project_overview;

                    // Options for the observer (which mutations to observe)
                    const config = { attributes: false, childList: true, subtree: true };

                    // Callback function to execute when mutations are observed
                    const callback = function(mutationsList, observer) {

                        // Use traditional 'for loops' for IE 11
                        for(const mutation of mutationsList) {
                            if (mutation.type === 'childList') {

                                console.log('A child node has been added or removed.');
                            } else if (mutation.type === 'attributes') {

                                console.log('The ' + mutation.attributeName + ' attribute was modified.');
                            } else if (mutation.type === 'subtree') {

                                console.log('The subtree attribute was modified.');
                            };

                            console.log(mutation, "and ", observer);
                        }
                    };

                    // Create an observer instance linked to the callback function
                    const observer = new MutationObserver(callback);

                    // Start observing the target node for configured mutations
                    observer.observe(target_node, config);

                    // Later, you can stop observing
                    // observer.disconnect();
                })();

                UI.return_to_dev_gallery_btns.forEach(btn => {

                    btn.addEventListener("click", () => {

                        UI.dev_project_gallery.scrollIntoView();
                    });
                });
            })();

            /*** CONTACT SECTION ***/

            /** Formspree validation **/

            // Example starter JavaScript for disabling form submissions if there are invalid fields
            (function() {
                
                const formspree = function() {

                    // Contact form validation responses on fail (for each form)
                    const validation_msgs = [
                        (function() {
                            return UI.display_form_validation_msg();
                        })
                    ];
                    
                    // Fetch all the forms we want to apply custom Bootstrap validation styles to using document.querySelectorAll('.needs-validation')
                    // Loop over them and prevent submission
                    Array.prototype.slice.call(UI.forms_need_validation)
                    .forEach(function(form, index) {
                        
                        (function() {
   
                            // Cycle through each form input/select/text area tags and store or populate with sessionStorage
                            form.querySelectorAll(".form-data").forEach(data => {

                                if(data.tagName === "INPUT") data.value = sessionStorage.getItem(data.name);
                                if(data.tagName === "TEXTAREA") data.value = sessionStorage.getItem(data.name);  
                                if(data.tagName === "SELECT") data.value = sessionStorage.getItem(data.name) || "";           
                                
                                //console.log(data, data.tagName, data.name, data.value);
                                select_change();
                                
                                // Save contact form info in cookies
                                data.addEventListener("input", debounce(() => {
 
                                    sessionStorage.setItem(data.name, (data.value));
                                }, 500));
                            });
                        })();
                        
                        // Heavily modified Bootstrap validation and Formspree functions (Ajax method - prevents redirection on form submit)
                        form.addEventListener("submit", (event) => {
                        
                            event.preventDefault();
                            // Stop multiple submits from occurring 
                            event.stopImmediatePropagation();
                            import('./Business_Logic/Formspree.js')
                            .then(module => module.default) // uses the default export
                            .then((Formspree) => {

                                if(!form.checkValidity()) {
    
                                    return new Promise((resolve,reject)=>{
                                        
                                        // Checks validation on submit
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
  
                                    ajax(My_Form.method, My_Form.url, My_Form.data, success, error, (status) => {
                                        
                                        // Callback executed onreadystatechange
                                        if(status === 200) {

                                            recaptchaCallback(() => {
                                       
                                                console.log("in grecaptcha callback", grecaptcha);
                                                form.classList.remove('was-validated');
                                                sessionStorage.clear();
                                                if(UI.country_select.labels[0].children[1] && UI.country_select.labels[0].children[1].tagName === "IMG") UI.country_select.labels[0].children[1].remove();
                                            });
                                        } else return;

                                        return;
                                    });
                                };
                            })
                            .catch(err => console.error("Failed to import module: ", err))
                        }, false);
                    });
                };

                // Populates form countries using API
                const Country_API = new API("https://restcountries.eu/rest/v2/all");

                let user_typed = false;
                const select_change = function() {

                    const selected_options = document.querySelectorAll("option");
                    // Adds country flag and phone calling code on country select
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
          
                    // Populates with API data
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
                .then(() => formspree()); // Executes formspree function regardless of promise fulfillment or rejection    
            })();

        }); // end of DOMContentLoaded event listener
    }, // end of init()
}; // end of App

App.init();



