'use strict';

console.log("App.js Loaded Successfully");

import "./Business_Logic/TagCloud.min.js";
import UI from "./UI_Logic/UI.js";
import { logger, calculate_age, wrapper_exec, wrapper_no_exec, debounce, throttle, scroll_progress,
    generate_dark_color_hex, form_submit_success, form_submit_error, ajax} from "./Business_Logic/Functions.js";
import Skill_Rating from "./Business_Logic/SkillRating.js";
import Project from "./Business_Logic/Project.js";
import Formspree from "./Business_Logic/Formspree.js";

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

                UI.replace_vid_bg();
                UI.header_vid.remove();
                header_vid_ended = true;
            })

            //document.addEventListener('scroll', debounce(logger, 1000));

            document.addEventListener("scroll", throttle(function() {

                // Calls horizontal progress bar indicator function on scroll
                scroll_progress(UI.scroll_indicator);
            }, 15));

            document.addEventListener("scroll", throttle(function() {

                console.log("throttling");

                // Resize header when scrolling - adds artificial height to compensate for reduction in header height and aid in smooth transitioning
                if(document.documentElement.scrollTop > 2 || window.pageYOffset > 2) {
                    
                    UI.shrink_header();
                    scroll_moved = true;
                } else {

                    UI.expand_header();
                    if(scroll_moved && header_vid_ended) {

                        UI.replace_vid_bg();
                    };
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

            UI.my_carousel_prev_btn.addEventListener("click", throttle(function() {

                UI.grow_btn_onclick(UI.my_carousel_prev_btn, 1.25, 250);
                UI.scroll_horizontally(UI.my_carousel_content, -360);
                UI.scroll_end(UI.my_carousel_content, 20);
            }, 700));

            UI.my_carousel_next_btn.addEventListener("click", throttle(function() {

                UI.grow_btn_onclick(UI.my_carousel_next_btn, 1.25, 250);
                UI.scroll_horizontally(UI.my_carousel_content, 360);
                UI.scroll_start(UI.my_carousel_content, 20);
            }, 700));

            /*** TOOLS & TECHNOLOGIES SECTION ***/

            /** Tag Cloud **/
            
            let tagcloud_radius;

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
            }, 1000); // end of tag cloud functions
            
            // Display star rating for each tool / technology based on skill level 
            UI.populate_skill_rating((new Skill_Rating));

            /*** PROJECTS SECTION ***/

            // Create Projects
            (function() {

                let current_project;

                // Alien Mathvasion Project
                const Alien_Mathvasion = new Project("Alien Mathvasion Game", 2, "https://dnoelmathinvasiongame.netlify.app/html/gamescreen.html", "Play", 
                    "https://github.com/DNoel26/Alien_Mathvasion", true);

                Alien_Mathvasion.description = `This project was designed for children ages 8+ with the goal of making math fun and engaging. It was built without any frameworks, libraries or dependencies using OOP and SOC principles, and with the 
                    intention of making code DRY and easier to maintain. Utilizes heavy JavaScript and DOM manipulation. Uses promises instead of while loops to track progress. Visual design is based on retro arcade Shoot-em Up games.
                    Good luck surviving the hardest difficulty!`
                Alien_Mathvasion.link_note = "(expect audio)";
                Alien_Mathvasion.notes.push(`Gameplay works completely but there are some minor bugs to fix, mainly in the areas of UI/UX. Very rarely, game does not load when difficulty is selected. Simply refresh the browser and try again.`);
                Alien_Mathvasion.notes.push(`Some features are missing such as player entered details, data persistence, settings; to be implemented at a later date.`);
                Alien_Mathvasion.notes.push(`Use Google Chrome for the best experience. Not yet fully responsive on smaller devices!`);

                Alien_Mathvasion.add_tool_icons(["a","b","c"],["src1","src2","src3"],["alt1","alt2","alt3"]);

                // Wix Clone Project
                const Wix_Clone = new Project("Wix Site Clone", 1, "https://dnoelmotorcyclewixclone.netlify.app/", "View", 
                    "https://github.com/DNoel26/Wix_Motorcycle_Trial", true);

                // Cyberdise Online Store Project
                const Cyberdise = new Project("Cyberdise Online Store", 2, "https://dnoelcyberdise.herokuapp.com/", "Interact", 
                    "https://github.com/DNoel26/Cyberdise-Dynamic-", true);

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

                UI.dev_project_gallery_btns.forEach(btn => {
                    
                    btn.addEventListener("click", () => {

                        logger(btn, btn.getAttribute("data-dev-project"), btn.dataset.devProject);
                    });
                });

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



