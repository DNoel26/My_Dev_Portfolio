console.log("App.js Loaded Successfully");

const App = {
    init() {

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
                delay: (el, i) => 6000 + 30 * i,
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
                delay: 2000,
            });
        
        const skill_rating = document.querySelectorAll(".skill-rating");
        const skill_rating_beginner = document.querySelectorAll(".skill-rating-beginner");
        const skill_rating_novice = document.querySelectorAll(".skill-rating-novice");
        const skill_rating_intermediate = document.querySelectorAll(".skill-rating-intermediate");
        const skill_rating_advanced = document.querySelectorAll(".skill-rating-advanced");
        const skill_rating_expert = document.querySelectorAll(".skill-rating-expert");

        //Header Video 
        const header = document.querySelector("header");
        const header_vid = document.querySelector("header video");

        document.addEventListener("DOMContentLoaded", ()=>{

            console.log("DOMContentLoaded Successfully");

            // Removes video after playing once and then adds a static background image (refresh to play video again)
            setTimeout(() => {
                header.style.background = "linear-gradient(rgba(31,111,139,0.8), rgba(0,0,0,0.6)), url('/img/laptop.jpg') no-repeat fixed";
                header.style.transition = "background 3s ease-in-out";
                //header.style.animation = "bg-fade-in 2s ease-in-out 0s 1"
                header_vid.remove();
                //header_img.style.transition = "opacity 1.5s";
                //header_img.style.opacity = "1 !important";
                //alert("TIME UP");
            },13000);

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
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-star-fill" viewBox="0 0 16 16">
                                    <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.283.95l-3.523 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                                </svg>
                             `;

                half_icon = `                                       
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-star-half" viewBox="0 0 16 16">
                                    <path d="M5.354 5.119L7.538.792A.516.516 0 0 1 8 .5c.183 0 .366.097.465.292l2.184 4.327 4.898.696A.537.537 0 0 1 16 6.32a.55.55 0 0 1-.17.445l-3.523 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256a.519.519 0 0 1-.146.05c-.341.06-.668-.254-.6-.642l.83-4.73L.173 6.765a.55.55 0 0 1-.171-.403.59.59 0 0 1 .084-.302.513.513 0 0 1 .37-.245l4.898-.696zM8 12.027c.08 0 .16.018.232.056l3.686 1.894-.694-3.957a.564.564 0 0 1 .163-.505l2.906-2.77-4.052-.576a.525.525 0 0 1-.393-.288L8.002 2.223 8 2.226v9.8z"/>
                                </svg>
                           `;

                empty_icon = ` 
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-star" viewBox="0 0 16 16">
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

            skill_rating_beginner.forEach(rating_div => {

                const skill = new Rating;
                rating_div.innerHTML = skill.getRating("beginner");
            });

            skill_rating_novice.forEach(rating_div => {
                
                const skill = new Rating;
                rating_div.innerHTML = skill.getRating("novice");
            });
            
            skill_rating_intermediate.forEach(rating_div => {

                const skill = new Rating;
                rating_div.innerHTML = skill.getRating("intermediate");
            });
            
            skill_rating_advanced.forEach(rating_div => {

                const skill = new Rating;
                rating_div.innerHTML = skill.getRating("advanced");
            });

            skill_rating_expert.forEach(rating_div => {

                const skill = new Rating;
                rating_div.innerHTML = skill.getRating("expert");
            });
        });
    },
};

App.init();



