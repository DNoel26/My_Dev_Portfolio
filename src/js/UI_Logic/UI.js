import { debounce, media_queries } from "../Business_Logic/Functions.js";
import Skill_Rating from "../Business_Logic/SkillRating.js";

const UI = {

    /*** GENERAL ***/

    body: document.body,
    google_preview_modal_btn: document.querySelector("[data-bs-toggle='modal']"),
    google_preview_modal: document.querySelector(".resume"),
    lazy_imgs: document.querySelectorAll("img.lazy"),
    lazy_sources: document.querySelectorAll("source"),
    lazy_bgs: document.querySelectorAll(".lazy-bg"),

    /*** HEADER ***/

    // Header Video 
    header: document.querySelector("header"),
    header_vid: document.querySelector("header video"),
    header_vid_multi: document.querySelectorAll("video [data-src]"),
    header_btns: document.querySelectorAll("button"),
    header_links: document.querySelectorAll("a"),
    nav_container: document.querySelector(".nav-container"),
    top_nav: document.querySelector(".top-header-nav"),
    bot_nav: document.querySelector(".bot-header-nav"),
    body_placeholder: document.querySelector("body .placeholder-div"),
    header_empty_div: document.querySelector("header .empty-div"),
    scroll_indicator: document.querySelector("#my-bar"),
    active_lists: document.querySelectorAll(".bot-header-nav .nav-item"),
    active_link: document.querySelector("a.active"),
    anchor_links: document.querySelectorAll("a.anchor-link"),

    // Hamburger menu button in header
    toggler_btn: document.querySelector(".navbar-toggler"),
    toggler_btn_icon: document.querySelector(".navbar-toggler-icon"),
    toggler_btn_word: document.querySelector(".navbar-toggler-word"),
    navbar_scroll: document.querySelector(".navbar-nav-scroll"),
    bot_nav_collapse: document.querySelector("#bot-header-nav"),

    /*** HOME SECTION ***/

    intro_msg: document.querySelector(".intro"),
    welcome: document.querySelector(".welcome"),
    text_wrapper_ml13: document.querySelector('.ml13'),
    
    // Generated by the shape divider app (remember to change class name if changing divider using app)
    header_divider: document.querySelector(".custom-shape-divider-bottom-1612032701"),

    /*** ABOUT SECTION ***/

    about_summary_wrapper: document.querySelector(".about-section .summary-wrapper"),
    my_age: document.querySelector("[data-age='my-age']"),
    summary_containers: document.querySelectorAll(".summary-container"),
    summary_btn: document.querySelector("[data-id='summary-btn']"),

    /*** SERVICES SECTION ***/

    my_carousel_prev_btn: document.querySelector(".services-section .my-carousel-btn-prev"),
    my_carousel_next_btn: document.querySelector(".services-section .my-carousel-btn-next"),
    my_carousel_wrapper: document.querySelector(".my-carousel-wrapper"),
    my_carousel_content: document.querySelector(".my-carousel-content"),
    my_carousel_items: document.querySelectorAll(".my-carousel-item"),

    /*** TOOLS & TECHNOLOGIES SECTION ***/ 

    tagcloud_content: document.querySelector(".tag-cloud-content"),
    tagcloud: document.querySelector(".tagcloud"),
    tagcloud_items: document.querySelectorAll(".tagcloud--item"),
    skill_ratings: document.querySelectorAll(".skill-rating"),
    skill_ratings_beginner: document.querySelectorAll(".skill-rating-beginner"),
    skill_ratings_novice: document.querySelectorAll(".skill-rating-novice"),
    skill_ratings_intermediate: document.querySelectorAll(".skill-rating-intermediate"),
    skill_ratings_advanced: document.querySelectorAll(".skill-rating-advanced"),
    skill_ratings_expert: document.querySelectorAll(".skill-rating-expert"),

    /*** PROJECT SECTION ***/ 

    // Development Projects
    return_to_dev_gallery_btns: document.querySelectorAll("[data-id='dev-project-gallery']"),
    dev_project_gallery: document.getElementById("dev-project-gallery"),
    dev_project_overview: document.getElementById("dev-project-overview"),
    dev_project_gallery_btns: document.querySelectorAll("button[data-dev-project]"),
    dev_project_carousel: document.getElementById("dev-project-carousel"),
    dev_project_carousel_indicator_section: document.getElementById("dev-project-carousel-indicators"),
    dev_project_carousel_inner_section: document.getElementById("dev-project-carousel-inner"),
    dev_project_carousel_note_section: document.getElementById("dev-project-carousel-notes"),
    dev_project_carousel_icon_section: document.getElementById("dev-project-carousel-icon-section"),
    dev_project_carousel_next: document.querySelectorAll("#dev-project-overview .carousel-control-next"),
    dev_project_carousel_prev: document.querySelectorAll("#dev-project-overview .carousel-control-prev"),

    // Client Projects
    client_project_gallery: document.getElementById("client-project-gallery"),
    client_project_overview: document.getElementById("client-project-overview"),
    client_project_gallery_btns: document.querySelectorAll("button[data-client-project]"),
    client_project_carousel: document.getElementById("client-project-carousel"),
    client_project_carousel_indicator_section: document.getElementById("client-project-carousel-indicators"),
    client_project_carousel_inner_section: document.getElementById("client-project-carousel-inner"),
    client_project_carousel_note_section: document.getElementById("client-project-carousel-notes"),
    client_project_carousel_icon_section: document.getElementById("client-project-carousel-icon-section"),
    client_project_carousel_next: document.querySelectorAll("#client-project-overview .carousel-control-next"),
    client_project_carousel_prev: document.querySelectorAll("#client-project-overview .carousel-control-prev"),

    /*** CONTACT ME SECTION ***/
    
    form_data: document.querySelectorAll(".form-data"),
    country_select: document.getElementById("country"),
    phone: document.getElementById("phone"),

    /* Formspree */

    valid_feedback_fname: document.querySelector(".valid-feedback.valid-feedback-fname"),
    valid_feedback_lname: document.querySelector(".valid-feedback.valid-feedback-lname"),
    valid_feedback_email: document.querySelector(".valid-feedback.valid-feedback-email"),
    valid_feedback_country: document.querySelector(".valid-feedback.valid-feedback-country"),
    valid_feedback_message: document.querySelector(".valid-feedback.valid-feedback-message"),
    invalid_feedback_fname: document.querySelector(".invalid-feedback.invalid-feedback-fname"),
    invalid_feedback_lname: document.querySelector(".invalid-feedback.invalid-feedback-lname"),
    invalid_feedback_email: document.querySelector(".invalid-feedback.invalid-feedback-email"),
    invalid_feedback_country: document.querySelector(".invalid-feedback.invalid-feedback-country"),
    invalid_feedback_message: document.querySelector(".invalid-feedback.invalid-feedback-message"),

    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    forms_need_validation: document.querySelectorAll('.needs-validation'),

    // Get the form elements defined in your form HTML
    my_form: document.getElementById("my-form"),
    my_form_button: document.getElementById("my-form-button"),
    my_form_status: document.getElementById("my-form-status"),
    grecaptchas: document.getElementsByClassName("g-recaptcha"),

    create_scripts(...srcs) {
        srcs.forEach(src => {
            const script = document.createElement("script");
            script.src = src;
            script.setAttribute("async", "async");
            this.body.appendChild(script);    
        });
    },

    load_bg_vid() {        
        //console.log(this.header_vid_multi);
        this.header_vid_multi.forEach(vid => {
            const data_src = vid.getAttribute("data-src");
            const data_media = vid.getAttribute("data-media");
            const mq_limit = window.matchMedia(data_media);

            media_queries(mq_limit, () => {                
                vid.setAttribute("src", data_src);
                vid.setAttribute("media", data_media);
                vid.parentElement.load();
            }, () => vid.removeAttribute("src"));
        });
    },

    add_poster_img_sm() {
        const mq_limit = window.matchMedia("(max-width: 767.98px)");

        media_queries(mq_limit, () => { 
            this.header_vid.setAttribute("poster", "./img/base/webp/think-different-700.webp");
        }, null);
    },

    toggler_menu_icon_switch() {
        setInterval(() => {
            if (this.toggler_btn_word.classList.contains("d-none") && this.toggler_btn_word) {
                this.toggler_btn_icon.classList.add("d-none");
                this.toggler_btn_word.classList.remove("d-none");
            } else if (this.toggler_btn_icon.classList.contains("d-none") && this.toggler_btn_word) {
                this.toggler_btn_icon.classList.remove("d-none");
                this.toggler_btn_word.classList.add("d-none");
            };
        }, 5000);
    },

    side_menu_reveal() {
        UI.bot_nav_collapse.classList.add("side-menu-reveal");
        UI.bot_nav_collapse.classList.remove("side-menu-hide");
    },

    side_menu_hide() {
        UI.bot_nav_collapse.classList.remove("side-menu-reveal");
        UI.bot_nav_collapse.classList.add("side-menu-hide");
    },

    mobile_menu_reveal() {
        UI.header.classList.add("mobile-menu-reveal");
        UI.header.classList.remove("mobile-menu-hide");
    },

    mobile_menu_hide() {
        UI.header.classList.remove("mobile-menu-reveal");
        UI.header.classList.add("mobile-menu-hide");
    },

    no_menu() {    
        UI.bot_nav_collapse.classList.remove("side-menu-hide");
        UI.bot_nav_collapse.classList.remove("side-menu-reveal");
        UI.header.classList.remove("mobile-menu-hide");
        UI.header.classList.remove("mobile-menu-reveal");
        UI.bot_nav_collapse.classList.remove("show");
    },

    shrink_header() {       
        // On scroll, shrinks header and expands body, pauses video, changes to static bg and adjusts height of placeholder elements for smooth transition
        this.body.classList.remove("will-change-height");
        this.nav_container.classList.add("nav-container-sticky");
        this.header.style.height = "100px";
        this.header.style.boxShadow = "0 0.1rem 5rem rgba(0,0,0,0.5)";
        this.header_vid.classList.add("d-none");
        this.header_vid.pause();
        this.header.style.background = "linear-gradient(rgba(31,111,139,1), rgba(31,111,139,1)), url('./img/transparent-png-w10.png') no-repeat fixed 100% 100%";
        
        // On scroll, hides introduction msg and removes top padding from welcome section below
        this.intro_msg.classList.add("h-0");   
    },

    expand_placeholder_div() {
        this.body_placeholder.style.height = "100vh"; // 46.875rem for large, 520px for smaller
        this.body_placeholder.classList.replace("invisible", "visible");
        this.body_placeholder.classList.replace("placeholder-div-reveal-start", "placeholder-div-reveal-end");
    },

    expand_header() {
        // Returns header and body to initial states when scrolled to the top
        this.body.classList.add("will-change-height");
        this.nav_container.classList.remove("nav-container-sticky");

        const mq_limits = [
            window.matchMedia("(min-width: 992px)"),
            window.matchMedia("(max-width: 991.98px)"),
        ];

        media_queries(mq_limits[0], () => {
            this.header.style.height = "70vh";
        }, null);

        media_queries(mq_limits[1], () => {
            this.header.style.height = "70vh";  
        }, null);

        this.header.style.boxShadow = "unset";
        this.header_vid.classList.remove("d-none");
        this.header_vid.play();

        // Returns introduction msg and welcome section to initial state when scrolled to the top
        this.intro_msg.classList.remove("h-0");   
    },

    shrink_placeholder_div() {
        this.body_placeholder.style.height = "0";
        this.body_placeholder.classList.replace("visible", "invisible");
        this.body_placeholder.classList.replace("placeholder-div-reveal-end", "placeholder-div-reveal-start");
    },

    replace_vid_bg() {
        // To replace the header video bg when it ends
        this.header.style.background = "linear-gradient(rgba(31,111,139,0.8), rgba(0,0,0,0.6)), url('./img/base/webp/laptop-keyboard.webp') no-repeat fixed 20% 20%";
        this.header.style.backgroundSize = "cover";
    },

    fixed_bottom_header() {
        const mq_limit = window.matchMedia("(max-width: 767.98px)")
        media_queries(mq_limit, () => {
            this.header.classList.replace("sticky-top", "fixed-bottom");
        }, () => {
            this.header.classList.replace("fixed-bottom", "sticky-top");
        });
    },

    no_fixed_bottom_header() {
        if (this.header.classList.contains("fixed-bottom")) this.header.classList.replace("fixed-bottom", "sticky-top");
    },

    animate_letters() {
        // Wrap every letter in a span
        this.text_wrapper_ml13.innerHTML = this.text_wrapper_ml13.textContent.replace(/\S/g, "<span class='letter'>$&</span>");
        
        anime.timeline({loop: true})
        .add({
            targets: '.ml13 .letter',
            translateY: [100,0],
            translateZ: 0,
            opacity: [0,1],
            easing: "easeOutExpo",
            duration: 600,
            delay: (el, i) => 300 + 30 * i,
        })
        .add({
            targets: '.ml13 .letter',
            translateY: [0,-100],
            opacity: [1,0],
            easing: "easeInExpo",
            duration: 600,
            delay: (el, i) => 6000 + 30 * i,
        });
    },

    change_about_info() {
        if (this.summary_containers[1].classList.contains("d-none")) {
            this.about_summary_wrapper.classList.add("opacity-0");

            setTimeout(() => {            
                this.summary_containers[0].classList.add("d-none", "opacity-0");
                this.summary_containers[1].classList.remove("d-none", "opacity-0");
                this.summary_btn.innerHTML = `
                    <span class="circle" aria-hidden="true">
                        <i class="fas fa-info-circle"></i>
                    </span>

                    <span class="btn-text">
                        Learn More
                    </span>
                `;
            }, 205);

            setTimeout(() => {
                this.about_summary_wrapper.classList.remove("opacity-0");
            }, 350);
        } else if (this.summary_containers[0].classList.contains("d-none")) {
            this.about_summary_wrapper.classList.add("opacity-0");

            setTimeout(() => {             
                this.summary_containers[1].classList.add("d-none", "opacity-0");
                this.summary_containers[0].classList.remove("d-none", "opacity-0");
                this.summary_btn.innerHTML = `
                    <span class="circle" aria-hidden="true">
                        <i class="fas fa-info-circle"></i>
                    </span>

                    <span class="btn-text">
                        Learn More
                    </span>
                `;
            }, 205);

            setTimeout(() => {
                this.about_summary_wrapper.classList.remove("opacity-0");
            }, 350);
        };
    },

    grow_btn_onclick(btn, size, time) {
        btn.style.transform = `scale(${size})`;

        setTimeout(() => {            
            btn.style.transform = "initial";
        }, time);
    },

    scroll_horizontally(el, px) {
        el.scrollLeft += px;
    },

    scroll_start(el, px_limit) {
        if (el.scrollLeft >= (el.scrollWidth - el.clientWidth - px_limit)) {
            el.scrollLeft = 0;
        };
    },

    scroll_end(el, px_limit) {
        if(el.scrollLeft <= px_limit) {
            el.scrollLeft = (el.scrollWidth - el.clientWidth);
        };
    },

    populate_skill_rating(Skill) {
        this.skill_ratings_beginner.forEach(rating_div => {
            rating_div.innerHTML = Skill.getRating("beginner");
        });
        
        this.skill_ratings_novice.forEach(rating_div => {     
            rating_div.innerHTML = Skill.getRating("novice");
        });
        
        this.skill_ratings_intermediate.forEach(rating_div => {
            rating_div.innerHTML = Skill.getRating("intermediate");
        });
        
        this.skill_ratings_advanced.forEach(rating_div => {
            rating_div.innerHTML = Skill.getRating("advanced");
        });

        this.skill_ratings_expert.forEach(rating_div => {
            rating_div.innerHTML = Skill.getRating("expert");
        });
    },

    display_form_validation_msg() {
        // Updates UI with different success validation messages after failure to submit correctly
        if (this.invalid_feedback_fname && window.getComputedStyle(this.invalid_feedback_fname).display != "none") {
            this.valid_feedback_fname.innerHTML = "Nice! You remembered your first name!";
        };

        if (this.invalid_feedback_lname && window.getComputedStyle(this.invalid_feedback_lname).display != "none") {
            this.valid_feedback_lname.innerHTML = "So you do have a last name...";
        };

        if (this.invalid_feedback_email && window.getComputedStyle(this.invalid_feedback_email).display != "none") {

            this.valid_feedback_email.innerHTML = "Much better...please ensure that the spelling of your email is correct";
        };

        if(this.invalid_feedback_country && window.getComputedStyle(this.invalid_feedback_country).display != "none") {
            this.valid_feedback_country.innerHTML = "Welcome to Earth " + `👽`;
        };

        if (this.invalid_feedback_message && window.getComputedStyle(this.invalid_feedback_message).display != "none") {
            this.valid_feedback_message.innerHTML = "How did you forget the most important part? Oh well, at least it's fine now...";
        };
        
        return;
    },
};

export default UI;