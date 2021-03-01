'use strict';

console.log("App.js Loaded Successfully");

import "./Business_Logic/TagCloud.min.js";
import UI from "./GUI_Logic/UI.js";
import { calculate_age, debounce, logger, scroll_progress, throttle, 
    generate_dark_color_hex, bs_validate_forms, form_submit_success, form_submit_error, ajax} from "./Business_Logic/Functions.js";
import Skill_Rating from "./DB_Logic/SkillRating.js";
import Project from "./DB_Logic/Project.js";
import Formspree from "./Business_Logic/Formspree.js";

const App = {
    init() {

        /*** Main Document ***/

        const body = document.querySelector("body");

        const about_summary_wrapper = document.querySelector(".about-section .summary-wrapper");
        const my_age = document.querySelector("[data-age='my-age']");
        const summary_containers = document.querySelectorAll(".summary-container");
        const summary_btn = document.querySelector("[data-id='summary-btn']");

        //const submit_btn = document.querySelector("#submit-btn");

        //Header Video 

        const header = document.querySelector("header");
        const header_vid = document.querySelector("header video");
        const nav_container = document.querySelector(".nav-container");
        const scroll_indicator = document.querySelector("#my-bar");

        document.addEventListener("DOMContentLoaded", ()=>{
            
            console.log("DOMContentLoaded Successfully");

            /*** GENERAL ***/

            UI.body.classList.add("will-change-height");
            
            // Delay load of non-essential scripts
            setTimeout(() => {
                
                UI.create_script("https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js");
            }, 1000);

            setTimeout(() => {
                
                UI.create_script("https://code.tidio.co/edv8badlavwvekyo42tfkxyp6frut7yq.js", "https://www.google.com/recaptcha/api.js", "https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js");
            }, 3000);

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

            // Removes video after playing once and then adds a static background image (refresh to play video again)
            UI.header_vid.addEventListener("ended", ()=>{

                UI.header.style.background = "linear-gradient(rgba(31,111,139,0.8), rgba(0,0,0,0.6)), url('/img/laptop.jpg') no-repeat fixed";
                UI.header.style.backgroundSize = "cover";
                UI.header.style.transition = "background 3s ease-in-out";
                UI.header_vid.remove();
                header_vid_ended = true;
            })

            const top_nav = document.querySelector(".top-header-nav");
            const bot_nav = document.querySelector(".bot-header-nav");  
            const body_placeholder = document.querySelector("body .placeholder-div");
            const header_empty_div = document.querySelector("header .empty-div"); 
            const intro_msg = document.querySelector(".intro");
            const welcome = document.querySelector(".welcome");
            
            // Generated by the shape divider app (remember to change class name if changing divider using app)
            const header_divider = document.querySelector(".custom-shape-divider-bottom-1612032701");        

            body_placeholder.addEventListener("transitionend", ()=>{

                //console.log("trans end",body_placeholder)     
            });

            //document.addEventListener('scroll', debounce(logger, 1000));

            document.addEventListener("scroll", throttle(function() {

                // Calls horizontal progress bar indicator function on scroll
                scroll_progress(scroll_indicator);
            }, 15));

            document.addEventListener("scroll", throttle(function() {

                console.log("throttling");

                // Resize header when scrolling - adds artificial height to compensate for reduction in header height and aid in smooth transitioning
                if(document.documentElement.scrollTop > 2 || window.pageYOffset > 2) {
                    
                    console.log("off")
                    UI.shrink_header();
                    
                    scroll_moved = true;
                } else {
                    console.log("ON")
                    UI.expand_header();

                    if(scroll_moved && header_vid_ended) {

                        UI.replace_vid_bg();
                    };
                };
            }, 100));

            document.addEventListener("scroll", ()=>{

                //Add active-list class to active link to work with CSS ::before and ::after settings (does not work well with animations for dropdown when active is set to the link itself)
                const active_list = document.querySelectorAll(".bot-header-nav .nav-item");
                const active_link = document.querySelector("a.active");

                UI.active_list.forEach(li => {
                        
                    if(li.children[0].classList.contains("active")) {
  
                        li.classList.add("active-list");
                    } else {

                        li.classList.remove("active-list"); 
                    }
                });
            });

            /*** HOME SECTION ***/

            // Animate "Developer Portfolio"
            UI.animate_letters();

            /*** ABOUT ME SECTION ***/

            // Automatically adjust my age in bio based on date
            my_age.innerHTML = calculate_age();

            // Adds a fade in and out effect when clicking the button in my bio
            summary_btn.addEventListener("click", ()=>{

                console.log(summary_containers[0], "AND", summary_containers[1]);

                if(summary_containers[1].classList.contains("d-none")) {

                    about_summary_wrapper.classList.add("opacity-0");

                    setTimeout(() => {
                        
                        summary_containers[0].classList.add("d-none", "opacity-0");
                        summary_containers[1].classList.remove("d-none", "opacity-0");
                        summary_btn.innerHTML = "Go Back";
                    }, 110);

                    setTimeout(() => {

                        about_summary_wrapper.classList.remove("opacity-0");
                    }, 310);
                } else if(summary_containers[0].classList.contains("d-none")) {

                    about_summary_wrapper.classList.add("opacity-0");

                    setTimeout(() => {
                        
                        summary_containers[1].classList.add("d-none", "opacity-0");
                        summary_containers[0].classList.remove("d-none", "opacity-0");
                        summary_btn.innerHTML = "Learn More";
                    }, 110);

                    setTimeout(() => {

                        about_summary_wrapper.classList.remove("opacity-0");
                    }, 310);
                };
            });

            /*** MY SERVICES SECTION ***/

            /*** TOOLS & TECHNOLOGIES SECTION ***/

            /** Tag Cloud **/
            
            // Delay loading of tag cloud
            setTimeout(() => {
                
                // Define tags in js array
                let myTags = [
                    'OOP', 'SOC / MVC', 'RESTful-APIs',
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
                    radius: 320,

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
            }, 200); // end of tag cloud functions
            
            // Display star rating for each tool / technology based on skill level 
            UI.populate_skill_rating();

            /*** PROJECTS SECTION ***/

            const my_carousel_prev_btn = document.querySelector(".services-section .my-carousel-btn-prev");
            const my_carousel_next_btn = document.querySelector(".services-section .my-carousel-btn-next");

            my_carousel_prev_btn.addEventListener("click", ()=>{

                my_carousel_prev_btn.style.transform = "scale(1.2)";

                setTimeout(() => {
                    
                    my_carousel_prev_btn.style.transform = "initial";
                }, 200);
            });

            // Create Project Section
            
            const Alien_Mathvasion = new Project("Alien Mathvasion");

            Alien_Mathvasion.add_tool_icon(["a","b","c"],["src1","src2","src3"],["alt1","alt2","alt3"]);
            console.log(Alien_Mathvasion.tool_icon_list);
            console.log(Alien_Mathvasion.tool_icon_list.id[2]);

            /*** CONTACT SECTION ***/

            /** Formspree validation **/
            
            // Example starter JavaScript for disabling form submissions if there are invalid fields (Bootstrap)

            (function () {

                const My_Form = new Formspree(UI.my_form);
                My_Form.method = UI.my_form.method;
                My_Form.url = UI.my_form.action;

                console.log(My_Form.method, My_Form.url, My_Form.data);

                function success() {

                    form_submit_success(My_Form.form, UI.my_form_button, UI.my_form_status, My_Form.success_msg);
                };

                function error() {

                    form_submit_error(UI.my_form_status, My_Form.error_msg);
                };

                function submit() {

                    ajax(My_Form.method, My_Form.url, My_Form.data, success, error);
                }

                UI.my_form_button.addEventListener("click", () => {

                    My_Form.data = new FormData(My_Form.form);
                });

                const validate_disp = [UI.display_form_validation_msg];
                const ajax_call = [submit];
                
                bs_validate_forms(UI.forms_need_validation, validate_disp, ajax_call);
            })();
        }); // end of DOMContentLoaded event listener
    }, // end of init()
}; // end of App

App.init();



