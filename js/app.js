console.log("App.js Loaded Successfully");

import "../js/TagCloud.min.js";

const App = {
    init() {

        /*** Dependencies ***/

        // Wrap every letter in a span
        
        const textWrapperML13 = document.querySelector('.ml13');
        textWrapperML13.innerHTML = textWrapperML13.textContent.replace(/\S/g, "<span class='letter'>$&</span>");

        anime.timeline({loop: true})
            .add({
                targets: '.ml13 .letter',
                translateY: [100,0],
                translateZ: 0,
                opacity: [0,1],
                easing: "easeOutExpo",
                duration: 600,
                delay: (el, i) => 300 + 30 * i,
            }).add({
                targets: '.ml13 .letter',
                translateY: [0,-100],
                opacity: [1,0],
                easing: "easeInExpo",
                duration: 600,
                delay: (el, i) => 12000 + 30 * i,
            });
        
        // Wrap every letter in a span

        const textWrapperML9 = document.querySelector('.ml9 .letters');
        textWrapperML9.innerHTML = textWrapperML9.textContent.replace(/\S/g, "<span class='letter'>$&</span>");

        anime.timeline({loop: true})
            .add({
                targets: '.ml9 .letter',
                scale: [0, 1],
                duration: 1500,
                elasticity: 600,
                delay: (el, i) => 45 * (i+1),
            }).add({
                targets: '.ml9',
                opacity: 0,
                duration: 1500,
                easing: "easeOutExpo",
                delay: 11000,
            });

        /*** Tag Cloud ***/
        
        // Define tags in js array

        let myTags = [
            'OOP', 'SOC / MVC', 'RESTful-APIs',
            'Data-Structures', 'Continuous-Integration', 'UI / UX',
            'Testing', 'Version-Control', 'Debugging',
            'Algorithms', 'App-Development', 'Responsive-Design', 
            'Security', 'Optimization', 'Customer-Service',
        ];

        // Render a default tag cloud
        //let tagCloud = TagCloud('.tag-cloud-content', myTags);

        // Config tag cloud by overriding default parameters below

        let tagCloud = TagCloud('.tag-cloud-content', myTags, {

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

        //myTags = myTags.concat([]);
        //tagCloud.update(myTags);

        const tagcloud = document.querySelector(".tagcloud");
        const tagcloud_items = document.querySelectorAll(".tagcloud--item");

        /*** Bootstrap Scrollspy ***/

        /*let scrollSpy = new bootstrap.ScrollSpy(document.body, {

            target: '#page-nav',
        });

        let dataSpyList = [].slice.call(document.querySelectorAll('[data-bs-spy="scroll"]'))
        dataSpyList.forEach(function (dataSpyEl) {

            bootstrap.ScrollSpy.getInstance(dataSpyEl)
            .refresh()
        });*/

        /*** Main Document ***/
        
        const skill_ratings = document.querySelectorAll(".skill-rating");
        const skill_ratings_beginner = document.querySelectorAll(".skill-rating-beginner");
        const skill_ratings_novice = document.querySelectorAll(".skill-rating-novice");
        const skill_ratings_intermediate = document.querySelectorAll(".skill-rating-intermediate");
        const skill_ratings_advanced = document.querySelectorAll(".skill-rating-advanced");
        const skill_ratings_expert = document.querySelectorAll(".skill-rating-expert");

        const body = document.querySelector("main");

        const about_section = document.querySelector(".about-section .container");
        const my_age = document.querySelector("[data-age='my-age']");
        const summary_containers = document.querySelectorAll(".summary-container");
        const summary_btn = document.querySelector("[data-id='summary-btn']");

        //const submit_btn = document.querySelector("#submit-btn");

        //Header Video 

        const header = document.querySelector("header");
        const header_vid = document.querySelector("header video");
        const nav_container = document.querySelector(".nav-container");

        /*** FUNCTIONS ***/
        
        function scroll_progress() {
            const scroll_indicator = document.querySelector("#my-bar");
            const winScroll = document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            scroll_indicator.style.width = scrolled + "%";
        }

        document.addEventListener("DOMContentLoaded", ()=>{
            
            console.log("DOMContentLoaded Successfully");

            body.classList.add("will-change-height");

            //Watch for screen size changes 
            function on_resize(mq) {

                /*if (mq.matches) { // If media query matches
                    document.body.style.backgroundColor = "yellow";
                } else {
                    document.body.style.backgroundColor = "pink";
                }*/
            };
              
            const mq = window.matchMedia("(max-width: 540px)");
            on_resize(mq); // Call listener function at run time

            window.addEventListener("resize", ()=>{
            
                console.log("media query", window.matchMedia("(min-width: 0)"))
            });

            if(tagcloud == "") {
            
                tagcloud.remove();
            };

            tagcloud_items.forEach(item => {
            
                function generateDarkColorHex() {
                    let color = "#";
                    for (let i = 0; i < 3; i++)
                      color += ("0" + Math.floor(Math.random() * Math.pow(16, 2) / 2).toString(16)).slice(-2);
                    return color;
                }

                item.style.color = generateDarkColorHex(); 
    
                let clicked_once = false;
                let clicked_twice = false;
    
                item.addEventListener("click", ()=>{
    
                    //console.log(item); // transform: translate3d(-35px, -146.6px, 0px) scale (1)
                    //console.log(item.style.transform);   
                    //console.log(clicked_once);
    
                    if(clicked_once && clicked_twice) {
    
                        item.style.fontSize = "0"; 
    
                        setTimeout(() => {
                    
                            item.style.color = generateDarkColorHex(); 
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

            /*const scrollSpy = new bootstrap.ScrollSpy(document.body, {
                target: '.bot-header-nav',
                method: 'offset'
            });*/

            const options = {
                rootMargin: "10px",
                threshold: 0
            }

            let observer = new IntersectionObserver((entries) => {

                entries.forEach(entry => {
                    if(entry.intersectionRect.height > 0) {

                        console.log(entry)
                    } else {

                        console.log("else entry", entry)
                    }
                });
            }, options);

            //const test = document.querySelector("#contact");

            let scroll_moved = false;
            let header_vid_ended = false;

            // Removes video after playing once and then adds a static background image (refresh to play video again)

            header_vid.addEventListener("ended", ()=>{

                header.style.background = "linear-gradient(rgba(31,111,139,0.8), rgba(0,0,0,0.6)), url('/img/laptop.jpg') no-repeat fixed";
                header.style.backgroundSize = "cover";
                header.style.transition = "background 3s ease-in-out";
                header_vid.remove();

                //alert("video ended");
                header_vid_ended = true;
            })

            // Changes active class to parent node on scroll - works with BS scrollspy

            const top_nav = document.querySelector(".top-header-nav");
            const bot_nav = document.querySelector(".bot-header-nav");  
            const body_placeholder = document.querySelector("body .placeholder-div");
            const header_empty_div = document.querySelector("header .empty-div"); 
            const intro_msg = document.querySelector(".intro");
            const intro_div = document.querySelector(".intro-2")
            
            // Generated by the shape divider app (remember to change class name if changing divider using app)

            const header_divider = document.querySelector(".custom-shape-divider-bottom-1612032701");        

            body_placeholder.addEventListener("transitionend", ()=>{

                console.log("trans end",body_placeholder)     
            });

            document.addEventListener("scroll", ()=>{

                //observer.observe(test);

                // Calls horizontal progress bar indicator function on scroll

                scroll_progress();

                //Add active-list class to active link to work with CSS ::before and ::after settings (does not work well with animations for dropdown when active is set to the link itself)

                const active_list = document.querySelectorAll(".bot-header-nav .nav-item");
                const active_link = document.querySelector("a.active");

                active_list.forEach(li => {
                        
                    if(li.children[0].classList.contains("active")) {

                        //console.log(active_link);
                        //console.log(active_link.parentElement.classList);
                        li.classList.add("active-list");
                    } else {

                        li.classList.remove("active-list"); 
                    }
                });

                // Resize header when scrolling - adds artificial height to compensate for reduction in header height

                if(document.documentElement.scrollTop > 1 || window.pageYOffset > 1) {

                    //console.log(window.pageYOffset);
                    body.classList.remove("will-change-height");
                    
                    nav_container.classList.add("row","justify-content-between");
                    top_nav.classList.add("col-2");
                    bot_nav.classList.add("col-10");
                    header_empty_div.classList.add("d-none");
                    header_divider.classList.add("d-none");
                    body_placeholder.classList.replace("invisible","visible");

                    top_nav.style.height = "100%";
                    bot_nav.style.height = "100%";
                    nav_container.style.height = "6rem";
                    body_placeholder.style.height = "46.875rem";
                    body_placeholder.classList.replace("placeholder-div-reveal-start","placeholder-div-reveal-end");

                    header_vid.classList.add("d-none");
                    header_vid.pause();

                    intro_msg.classList.add("h-0");
                    intro_div.classList.remove("pt-custom-1");
                    
                    scroll_moved = true;
                    header.style.background = "linear-gradient(rgba(31,111,139,0.95), rgba(31,111,139,0.95)), url('') no-repeat fixed 100% 100%";
                } else {

                    nav_container.classList.remove("row","justify-content-between");
                    top_nav.classList.remove("col-2");
                    bot_nav.classList.remove("col-10");
                    header_empty_div.classList.remove("d-none");
                    header_divider.classList.remove("d-none");
                    //body_placeholder.classList.replace("visible","invisible");

                    top_nav.style.height = "initial";
                    bot_nav.style.height = "initial";
                    nav_container.style.height = "25rem";
                    body_placeholder.style.height = "0";
                    body_placeholder.classList.replace("placeholder-div-reveal-end","placeholder-div-reveal-start");

                    header_vid.classList.remove("d-none");
                    header_vid.play();

                    intro_msg.classList.remove("h-0");
                    intro_div.classList.add("pt-custom-1");

                    if(scroll_moved && header_vid_ended) {

                        header.style.background = "linear-gradient(rgba(31,111,139,0.8), rgba(0,0,0,0.6)), url('/img/laptop.jpg') no-repeat fixed";
                        header.style.backgroundSize = "cover";
                        header.style.transition = "background 3s ease-in-out";
                    }
                };
            });

            // About me section

            // Automatically adjust my age in bio based on date

            function calculate_age(dob) { 
                const diff_ms = Date.now() - new Date("26 March 1990");
                const age_dt = new Date(diff_ms); 
              
                return Math.abs(age_dt.getUTCFullYear() - 1970);
            }

            //console.log(calculate_age(new Date(1982, 20, 4)));
            my_age.innerHTML = calculate_age("06/24/2008");

            // Adds a fade in and out effect when clicking the button in my bio

            summary_btn.addEventListener("click", ()=>{

                console.log(summary_containers[0], "AND", summary_containers[1]);

                if(summary_containers[1].classList.contains("d-none")) {

                    about_section.classList.add("opacity-0");

                    setTimeout(() => {
                        
                        summary_containers[0].classList.add("d-none", "opacity-0");
                        summary_containers[1].classList.remove("d-none", "opacity-0");
                        summary_btn.innerHTML = "Go Back";
                    }, 110);

                    setTimeout(() => {

                        about_section.classList.remove("opacity-0");
                    }, 310);
                } else if(summary_containers[0].classList.contains("d-none")) {

                    about_section.classList.add("opacity-0");

                    setTimeout(() => {
                        
                        summary_containers[1].classList.add("d-none", "opacity-0");
                        summary_containers[0].classList.remove("d-none", "opacity-0");
                        summary_btn.innerHTML = "Learn More...";
                    }, 110);

                    setTimeout(() => {

                        about_section.classList.remove("opacity-0");
                    }, 310);
                };
            });

            //Generates skill rating divs and icons based on class name

            /* SVG path for filled star icon
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-star-fill" viewBox="0 0 16 16">
                    <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.283.95l-3.523 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                </svg>
            */

            /* SVG path for half-filled star icon
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-star-half" viewBox="0 0 16 16">
                    <path d="M5.354 5.119L7.538.792A.516.516 0 0 1 8 .5c.183 0 .366.097.465.292l2.184 4.327 4.898.696A.537.537 0 0 1 16 6.32a.55.55 0 0 1-.17.445l-3.523 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256a.519.519 0 0 1-.146.05c-.341.06-.668-.254-.6-.642l.83-4.73L.173 6.765a.55.55 0 0 1-.171-.403.59.59 0 0 1 .084-.302.513.513 0 0 1 .37-.245l4.898-.696zM8 12.027c.08 0 .16.018.232.056l3.686 1.894-.694-3.957a.564.564 0 0 1 .163-.505l2.906-2.77-4.052-.576a.525.525 0 0 1-.393-.288L8.002 2.223 8 2.226v9.8z"/>
                </svg>
            */

            /* SVG path for empty star icon
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-star" viewBox="0 0 16 16">
                    <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.523-3.356c.329-.314.158-.888-.283-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767l-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288l1.847-3.658 1.846 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.564.564 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z"/>
                </svg>
            */

            class Rating {

                classification = "";

                filled_icon = ` 
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-star-fill" viewBox="0 0 16 16">
                                    <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.283.95l-3.523 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                                </svg>
                             `;

                half_icon = `                                       
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-star-half" viewBox="0 0 16 16">
                                    <path d="M5.354 5.119L7.538.792A.516.516 0 0 1 8 .5c.183 0 .366.097.465.292l2.184 4.327 4.898.696A.537.537 0 0 1 16 6.32a.55.55 0 0 1-.17.445l-3.523 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256a.519.519 0 0 1-.146.05c-.341.06-.668-.254-.6-.642l.83-4.73L.173 6.765a.55.55 0 0 1-.171-.403.59.59 0 0 1 .084-.302.513.513 0 0 1 .37-.245l4.898-.696zM8 12.027c.08 0 .16.018.232.056l3.686 1.894-.694-3.957a.564.564 0 0 1 .163-.505l2.906-2.77-4.052-.576a.525.525 0 0 1-.393-.288L8.002 2.223 8 2.226v9.8z"/>
                                </svg>
                           `;

                empty_icon = ` 
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-star" viewBox="0 0 16 16">
                                    <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.523-3.356c.329-.314.158-.888-.283-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767l-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288l1.847-3.658 1.846 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.564.564 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z"/>
                                </svg>
                            `;
                
                getRating(rank){

                    if(rank === "beginner") {

                        rank = 1;
                    } else if (rank === "novice") {

                        rank = 2;
                    } else if (rank === "intermediate") {

                        rank = 3;
                    } else if (rank === "advanced") {

                        rank = 4;
                    } else if (rank === "expert") {

                        rank = 5;
                    };

                    for(let i=0; i<5; i++) {

                        if (rank > i) {

                            this.classification += this.filled_icon;
                        } else {

                            this.classification += this.empty_icon;
                        };
                    };

                    return this.classification;
                };
            };

            skill_ratings_beginner.forEach(rating_div => {

                const skill = new Rating;
                rating_div.innerHTML = skill.getRating("beginner");
            });

            skill_ratings_novice.forEach(rating_div => {
                
                const skill = new Rating;
                rating_div.innerHTML = skill.getRating("novice");
            });
            
            skill_ratings_intermediate.forEach(rating_div => {

                const skill = new Rating;
                rating_div.innerHTML = skill.getRating("intermediate");
            });
            
            skill_ratings_advanced.forEach(rating_div => {

                const skill = new Rating;
                rating_div.innerHTML = skill.getRating("advanced");
            });

            skill_ratings_expert.forEach(rating_div => {

                const skill = new Rating;
                rating_div.innerHTML = skill.getRating("expert");
            });

            /*** Formspree validation ***/
            
            // Example starter JavaScript for disabling form submissions if there are invalid fields (Bootstrap)

            (function () {
                'use strict'

                const valid_feedback_fname = document.querySelector(".valid-feedback.valid-feedback-fname");
                const valid_feedback_lname = document.querySelector(".valid-feedback.valid-feedback-lname");
                const valid_feedback_email = document.querySelector(".valid-feedback.valid-feedback-email");
                const valid_feedback_message = document.querySelector(".valid-feedback.valid-feedback-message");
                const invalid_feedback_fname = document.querySelector(".invalid-feedback.invalid-feedback-fname");
                const invalid_feedback_lname = document.querySelector(".invalid-feedback.invalid-feedback-lname");
                const invalid_feedback_email = document.querySelector(".invalid-feedback.invalid-feedback-email");
                const invalid_feedback_message = document.querySelector(".invalid-feedback.invalid-feedback-message");
            
                // Fetch all the forms we want to apply custom Bootstrap validation styles to

                let forms = document.querySelectorAll('.needs-validation')

                // Loop over them and prevent submission

                Array.prototype.slice.call(forms)
                .forEach(function (form) {
                    form.addEventListener('submit', function (event) {
                            
                        event.preventDefault();

                        // Formspree AJAX 
                        // Get the form elements defined in your form HTML above

                        const form = document.getElementById("my-form");
                        const button = document.getElementById("my-form-button");
                        const status = document.getElementById("my-form-status");

                        // Success and Error functions for after the form is submitted
                        
                        function success() {

                            form.reset();
                            button.setAttribute("disabled", "disabled");
                            status.innerHTML = "Thanks for your message! I'll review and respond as soon as possible.";
                        };

                        function error() {

                            status.innerHTML = 'Oops, sorry! There was a problem with the form submission. Ensure to check "I am not a robot" and try again or use an alternate method to contact me.';
                        };

                        if (!form.checkValidity()) {

                            event.stopPropagation();

                            // Ensures that validation changes only take effect after submission

                            return new Promise((resolve,reject)=>{

                                form.classList.add('was-validated');
    
                                resolve();
                            })
                            .then(()=>{
                                
                                // Updates UI with failed validation messages

                                //console.log(window.getComputedStyle(invalid_feedback_fname).display);
                                //console.log(window.getComputedStyle(valid_feedback_fname).display);
                                if(window.getComputedStyle(invalid_feedback_fname).display != "none") {
    
                                    valid_feedback_fname.innerHTML = "Nice! You remembered your first name!";
                                };
    
                                if(window.getComputedStyle(invalid_feedback_lname).display != "none") {
    
                                    valid_feedback_lname.innerHTML = "So you do have a last name...";
                                };
    
                                if(window.getComputedStyle(invalid_feedback_email).display != "none") {
    
                                    valid_feedback_email.innerHTML = "Much better...please ensure that the spelling of your email is correct";
                                };
    
                                if(window.getComputedStyle(invalid_feedback_message).display != "none") {
                                    valid_feedback_message.innerHTML = "How did you forget the most important part? Oh well, at least it's fine now...";
                                };
                            })
                            .catch(err=>reject(`Failed to validate Bootstrap form: ${err}`));
                        } else {

                            const data = new FormData(form);
                            ajax(form.method, form.action, data, success, error);

                            // Clears / resets the form on successful submission

                            invalid_feedback_fname.style.display = "none";
                            invalid_feedback_lname.style.display = "none";
                            invalid_feedback_email.style.display = "none";
                            invalid_feedback_message.style.display = "none";
                            form.classList.remove('was-validated', "is-invalid", "is-valid");

                            function ajax(method, url, data, success, error) {

                                const xhr = new XMLHttpRequest();
                                xhr.open(method, url);
                                xhr.setRequestHeader("Accept", "application/json");
                                xhr.onreadystatechange = function() {
                                    if (xhr.readyState !== XMLHttpRequest.DONE) return;
                                    if (xhr.status === 200) {

                                        success(xhr.response, xhr.responseType);
                                    } else {

                                        error(xhr.status, xhr.response, xhr.responseType);
                                    }
                                };
                                xhr.send(data);
                            };
                        };  
                    }, false);
                });
            })();
        }); // end of DOMContentLoaded event listener
    }, // end of init()
}; // end of App

App.init();



