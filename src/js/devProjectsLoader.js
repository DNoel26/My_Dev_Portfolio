/** @format */

import Project from './Business_Logic/Project.js';

export const devProjectsLoader = (UI) => {
    let current_project = {};
    let new_inner_html = ``;
    const dev_project_carousel = new bootstrap.Carousel(
        UI.dev_project_carousel,
        {
            interval: 5000,
        },
    );

    // Adds an indicator button, along with attributes per image and sets active class to first slide
    // Accepts a single parameter with values "dev" or "client"
    const populate_carousel_indicators = function (proj_type) {
        current_project.carousel_img_list.srcs.forEach((indicator, index) => {
            const btn = document.createElement('button');
            btn.setAttribute('type', 'button');
            btn.setAttribute('data-bs-target', '#dev-project-carousel');
            if (index === 0)
                btn.classList.add('active', 'btn'),
                    btn.setAttribute('aria-current', 'true');
            else btn.classList.add('btn');
            btn.setAttribute('aria-label', `Slide ${index + 1}`);

            // Append to dev or client project depending on parameter set
            if (proj_type === 'dev'.toLowerCase())
                UI.dev_project_carousel_indicator_section.appendChild(btn);
            else if (proj_type === 'client'.toLowerCase())
                UI.dev_project_carousel_indicator_section.appendChild(btn);
        });
    };

    // Adds each image along with attributes, to the carousel slideshow
    // Accepts a single parameter with values "dev" or "client"
    const populate_carousel_img_data = function (proj_type) {
        current_project.carousel_img_list.srcs.forEach((src, index) => {
            const div = document.createElement('div');
            if (index === 0) div.classList.add('carousel-item', 'active');
            else div.classList.add('carousel-item');
            const img = document.createElement('img');
            img.setAttribute('loading', 'lazy');
            img.classList.add('d-block', 'w-100', 'p-3');
            img.setAttribute('src', src);
            img.setAttribute(
                'alt',
                current_project.carousel_img_list.alts[index] ||
                    'My project carousel image',
            );
            img.setAttribute('width', '625');
            img.setAttribute('height', '500');
            div.appendChild(img);

            // Append to dev or client project depending on parameter set
            if (proj_type === 'dev'.toLowerCase())
                UI.dev_project_carousel_inner_section.appendChild(div);
            else if (proj_type === 'client'.toLowerCase())
                UI.client_project_carousel_inner_section.appendChild(div);
        });
    };

    // Adds notes to project overview
    // Accepts a single parameter with values "dev" or "client"
    const populate_project_notes = function (proj_type) {
        current_project.notes.forEach((note, index) => {
            const list = document.createElement('li');
            list.innerHTML = note;
            if (index === current_project.notes.length - 1)
                list.classList.add('fw-bold');

            // Append to dev or client project depending on parameter set
            if (proj_type === 'dev'.toLowerCase())
                UI.dev_project_carousel_note_section.appendChild(list);
            else if (proj_type === 'client'.toLowerCase())
                UI.client_project_carousel_note_section.appendChild(list);
        });
    };

    // Adds each tool / technology icon to the end of the project overview
    // Accepts a single parameter with values "dev" or "client"
    const populate_project_tool_icons = function (proj_type) {
        current_project.tool_icon_list.srcs.forEach((src, index) => {
            const img = document.createElement('img');
            img.setAttribute('loading', 'lazy');
            img.classList.add('img-fluid', 'icon-disp-img-lg', 'm-3');
            img.id = current_project.tool_icon_list.ids[index] || null;
            img.setAttribute('src', src);
            img.setAttribute(
                'alt',
                current_project.tool_icon_list.alts[index] ||
                    'Tool and Technology Icon Badge',
            );
            img.setAttribute('width', '85');
            img.setAttribute('height', '64');

            // Append to dev or client project depending on parameter set
            if (proj_type === 'dev'.toLowerCase())
                UI.dev_project_carousel_icon_section.appendChild(img);
            else if (proj_type === 'client'.toLowerCase())
                UI.client_project_carousel_icon_section.appendChild(img);
        });
    };
    const change_project = function () {
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

                            <button class="btn btn-custom-2 my-5 d-block mx-auto w-auto btn-anim d-xl-none" data-id="dev-project-gallery">
                                <span class="circle" aria-hidden="true">
                                    <i class="fas fa-arrow-alt-circle-up"></i>
                                </span>

                                <span class="btn-text">
                                    Return to Gallery
                                </span>
                            </button>
                        </div>
                    </div>
                `;
    };
    const reinitialize_el = function () {
        // Re-declare (update) document IDs on new inner html
        UI.return_to_dev_gallery_btns = document.querySelectorAll(
            "[data-id='dev-project-gallery']",
        );
        UI.dev_project_carousel = document.getElementById(
            'dev-project-carousel',
        );
        UI.dev_project_carousel_indicator_section = document.getElementById(
            'dev-project-carousel-indicators',
        );
        UI.dev_project_carousel_inner_section = document.getElementById(
            'dev-project-carousel-inner',
        );
        UI.dev_project_carousel_note_section = document.getElementById(
            'dev-project-carousel-notes',
        );
        UI.dev_project_carousel_icon_section = document.getElementById(
            'dev-project-carousel-icon-section',
        );
        populate_carousel_img_data('dev');
        populate_carousel_indicators('dev');
        populate_project_notes('dev');
        populate_project_tool_icons('dev');
        dispatchEvent(new Event('load'));
    };

    // Alien Mathvasion Project
    const Alien_Mathvasion = new Project(
        'Alien Mathvasion Game',
        2,
        'https://dnoelmathinvasiongame.netlify.app/html/gamescreen.html',
        'Play',
        'https://github.com/DNoel26/Alien_Mathvasion',
        true,
    );
    Alien_Mathvasion.description = `This project was designed for children ages 8+ with the goal of making math fun and engaging. It was built from scratch without any frameworks, libraries or dependencies using OOP and SOC principles, and with the 
                intention of making code DRY and easier to maintain. Utilizes heavy JavaScript and DOM manipulation. Uses promises instead of while loops to track progress. Visual design is based on retro arcade Shoot-em Up games.
                Good luck surviving the hardest difficulty!
            `;
    Alien_Mathvasion.link_note = '(expect audio - desktop version only!)';
    Alien_Mathvasion.notes.push(
        `Gameplay works completely but there are some minor bugs to fix, mainly in the areas of UI/UX. Very rarely, game does not load when difficulty is selected. Simply refresh the browser and try again.`,
    );
    Alien_Mathvasion.notes.push(
        `Some features are missing such as player entered details, data persistence, settings; to be implemented at a later date.`,
    );
    Alien_Mathvasion.notes.push(
        `Use Google Chrome for the best experience. Not yet fully responsive on smaller devices!`,
    );
    const alien_m_carousel_img_ids = [];
    const alien_m_carousel_img_srcs = [
        './img/projects/min/alien-mathvasion-1-min.webp',
        './img/projects/min/alien-mathvasion-2-min.webp',
        './img/projects/min/alien-mathvasion-3-min.webp',
    ];
    const alien_m_carousel_img_alts = [];
    const alien_m_tool_img_ids = [];
    const alien_m_tool_img_srcs = [
        './img/logos/html5-badge.webp',
        './img/logos/css3-badge.webp',
        './img/logos/javascript-badge.webp',
    ];
    const alien_m_tool_img_alts = [];
    Alien_Mathvasion.add_imgs(
        alien_m_carousel_img_ids,
        alien_m_carousel_img_srcs,
        alien_m_carousel_img_alts,
    );
    Alien_Mathvasion.add_tool_icons(
        alien_m_tool_img_ids,
        alien_m_tool_img_srcs,
        alien_m_tool_img_alts,
    );

    // Wix Clone Project
    const Wix_Clone = new Project(
        'Wix Site Clone',
        1,
        'https://dnoelmotorcyclewixclone.netlify.app/',
        'View',
        'https://github.com/DNoel26/Wix_Motorcycle_Trial',
        true,
    );
    Wix_Clone.description = `This was my first official development project and was intended to be a pixel for pixel clone of
                <a target="_blank" class="text-reset text-decoration-none anim-link-3" rel="noopener" href="https://www.wix.com/website-template/view/html/773?siteId=32647d89-1460-4326-b084-a958bf90765d&metaSiteId=129904ad-3051-8c87-f69f-31ce75166f9c&originUrl=https%3A%2F%2Fwww.wix.com%2Fwebsite%2Ftemplates%3Fcriteria%3Dauto&tpClick=view_button">a selected, original Wix site</a>. 
                It was built using HTML, CSS and without any JavaScript. 
                Showcases the ability to take a design and convert it into a functional webpage or website.
            `;
    Wix_Clone.link_note = '(see link to cloned Wix site above)';
    Wix_Clone.notes.push(
        `Only 3 pages were cloned for this project: Home, About and Contact.`,
    );
    Wix_Clone.notes.push(`Website is fully responsive for all devices!`);
    const wix_c_carousel_img_ids = [];
    const wix_c_carousel_img_srcs = [
        './img/projects/min/wix-clone-1-min.webp',
        './img/projects/min/wix-clone-2-min.webp',
        './img/projects/min/wix-clone-3-min.webp',
    ];
    const wix_c_carousel_img_alts = [];
    const wix_c_tool_img_ids = [];
    const wix_c_tool_img_srcs = [
        './img/logos/html5-badge.webp',
        './img/logos/css3-badge.webp',
    ];
    const wix_c_tool_img_alts = [];
    Wix_Clone.add_imgs(
        wix_c_carousel_img_ids,
        wix_c_carousel_img_srcs,
        wix_c_carousel_img_alts,
    );
    Wix_Clone.add_tool_icons(
        wix_c_tool_img_ids,
        wix_c_tool_img_srcs,
        wix_c_tool_img_alts,
    );

    // Cyberdise Online Store Project
    const Cyberdise = new Project(
        'Cyberdise Online Store',
        2,
        'https://dnoelcyberdise.herokuapp.com/',
        'Interact',
        'https://github.com/DNoel26/Cyberdise-Dynamic-',
        true,
    );
    Cyberdise.description = `This project was my first official Full Stack development project and end-to-end C.R.U.D. application, and was designed to test everything I had learned (and more). This online store was built from scratch using MVC principles for the Back End code.
                The database was designed, normalized and created in MySQL. There are both customer and employee functionalities to experiment with. Features such as 
                authorization, authentication, page protection, session storage, pagination, multiple queries per database call, database transactions, product tracking, product restocking, add to cart, payment processing using a modified PayPal SDK, to name a few, were all built from the ground up and implemented in this site.
                Check it out and let me know what you think! Please use only FAKE CREDENTIALS if creating a customer account to login. See my GitHub readme for instructions on how to log in as an employee to stock, re-stock and/or modify product data etc. 
            `;
    Cyberdise.link_note = '(fake credentials only - desktop version only!)';
    Cyberdise.notes.push(
        `Most other major features are working as expected. Search functionality not implemented just yet.`,
    );
    Cyberdise.notes.push(`Some UI elements are incomplete/missing.`);
    Cyberdise.notes.push(`Not yet fully responsive on smaller devices!`);
    const cyberdise_carousel_img_ids = [];
    const cyberdise_carousel_img_srcs = [
        './img/projects/min/cyberdise-online-store-1-min.webp',
        './img/projects/min/cyberdise-online-store-2-min.webp',
        './img/projects/min/cyberdise-online-store-3-min.webp',
        './img/projects/min/cyberdise-online-store-4-min.webp',
        './img/projects/min/cyberdise-online-store-5-min.webp',
    ];
    const cyberdise_carousel_img_alts = [];
    const cyberdise_tool_img_ids = [];
    const cyberdise_tool_img_srcs = [
        './img/logos/html5-badge.webp',
        './img/logos/css3-badge.webp',
        './img/logos/javascript-badge.webp',
        './img/logos/handlebars-badge.webp',
        '/img/logos/mysql-badge.webp',
        './img/logos/nodejs-badge.webp',
        './img/logos/express-logo.webp',
        './img/logos/postman-badge.webp',
    ];
    const cyberdise_tool_img_alts = [];
    Cyberdise.add_imgs(
        cyberdise_carousel_img_ids,
        cyberdise_carousel_img_srcs,
        cyberdise_carousel_img_alts,
    );
    Cyberdise.add_tool_icons(
        cyberdise_tool_img_ids,
        cyberdise_tool_img_srcs,
        cyberdise_tool_img_alts,
    );

    // Movie Database Project
    const Movie_Database = new Project(
        'Movie Database',
        2,
        'https://dnoelmovieapidatabase.netlify.app/',
        'View',
        'https://github.com/DNoel26/Movie_Database',
        true,
    );
    Movie_Database.description = `
                This project was built from scratch to dynamically display "Now Showing" movie details and trailers via consuming multiple APIs; meaning all data shown on my website is requested
                and pulled from another server, and manipulated on my website using JavaScript. Design is based on retro theatres. Click the link and take a look at all the trending movies now!
            `;
    Movie_Database.link_note = '(desktop version only!)';
    Movie_Database.notes.push(
        `All major features are working as expected. Pagination to be implemented.`,
    );
    Movie_Database.notes.push(`Not yet fully responsive on smaller devices!`);
    const movie_db_carousel_img_ids = [];
    const movie_db_carousel_img_srcs = [
        './img/projects/min/movie-db-1-min.webp',
        './img/projects/min/movie-db-2-min.webp',
        './img/projects/min/movie-db-3-min.webp',
    ];
    const movie_db_carousel_img_alts = [];
    const movie_db_tools_img_ids = [];
    const movie_db_tools_img_srcs = [
        './img/logos/html5-badge.webp',
        './img/logos/css3-badge.webp',
        './img/logos/javascript-badge.webp',
    ];
    const movie_db_tools_img_alts = [];
    Movie_Database.add_imgs(
        movie_db_carousel_img_ids,
        movie_db_carousel_img_srcs,
        movie_db_carousel_img_alts,
    );
    Movie_Database.add_tool_icons(
        movie_db_tools_img_ids,
        movie_db_tools_img_srcs,
        movie_db_tools_img_alts,
    );

    // Amazon Clone Project
    const Amazon_Clone = new Project(
        'Amazon Clone',
        2,
        'https://clone-905a7.web.app/',
        'Interact',
        'https://github.com/DNoel26/Amazon_React_Clone',
        true,
    );
    Amazon_Clone.description = `
                This project was done as my hands on introduction to React.js and Firebase. In this particular case, I followed a tutorial and manipulated my code rather than building from scratch.
                The main purpose was to understand the concepts behind the very popular React.js framework, as well as to learn new methods for coding. Main project features are account creation, 
                login, add to cart, and payment processing using Stripe API. Please use only FAKE CREDENTIALS if creating an account to login. See my GitHub readme for further instructions. 
            `;
    Amazon_Clone.link_note = '(fake credentials only - desktop version only!)';
    Amazon_Clone.notes.push(`All major features are working as expected.`);
    Amazon_Clone.notes.push(`Not yet fully responsive on smaller devices!`);
    const amazon_c_carousel_img_ids = [];
    const amazon_c_carousel_img_srcs = [
        './img/projects/min/amazon-clone-1-min.webp',
        './img/projects/min/amazon-clone-2-min.webp',
        './img/projects/min/amazon-clone-3-min.webp',
        './img/projects/min/amazon-clone-4-min.webp',
    ];
    const amazon_c_carousel_img_alts = [];
    const amazon_c_tool_img_ids = [];
    const amazon_c_tool_img_srcs = [
        './img/logos/html5-badge.webp',
        './img/logos/css3-badge.webp',
        './img/logos/javascript-badge.webp',
        './img/logos/react-badge.webp',
        './img/logos/firebase-badge.webp',
        './img/logos/nodejs-badge.webp',
        './img/logos/express-logo.webp',
    ];
    const amazon_c_tool_img_alts = [];
    Amazon_Clone.add_imgs(
        amazon_c_carousel_img_ids,
        amazon_c_carousel_img_srcs,
        amazon_c_carousel_img_alts,
    );
    Amazon_Clone.add_tool_icons(
        amazon_c_tool_img_ids,
        amazon_c_tool_img_srcs,
        amazon_c_tool_img_alts,
    );

    // Real Estate Website Project
    const Real_Estate_Site = new Project(
        'Real Estate Site',
        3,
        'https://presidentialrealtors-dev-static.netlify.app/',
        'View',
        'https://github.com/DNoel26/Presidential-Realtors-Static',
        true,
    );
    Real_Estate_Site.description = `
                The focus of this project was for me to learn and implement modern design, user interface (UI) and user experience (UX) elements. It was built from scratch and will eventually be converted
                to a fully functional single page application (SPA) using React.js, MongoDB, Node.js and Express.js. Let me know what you think!
            `;
    Real_Estate_Site.link_note = '(desktop version only!)';
    Real_Estate_Site.notes.push(
        `Most client side features work as expected. Focus of this project was on design elements rather than functionality.`,
    );
    Real_Estate_Site.notes.push(
        `Project to be redone as an app (SPA) with the the functionalities expected of a real estate website.`,
    );
    Real_Estate_Site.notes.push(`Not yet fully responsive on smaller devices!`);
    const real_estate_carousel_img_ids = [];
    const real_estate_carousel_img_srcs = [
        './img/projects/min/real-estate-1-min.webp',
        './img/projects/min/real-estate-2-min.webp',
        './img/projects/min/real-estate-3-min.webp',
    ];
    const real_estate_carousel_img_alts = [];
    const real_estate_tool_img_ids = [];
    const real_estate_tool_img_srcs = [
        './img/logos/html5-badge.webp',
        './img/logos/css3-badge.webp',
    ];
    const real_estate_tool_img_alts = [];
    Real_Estate_Site.add_imgs(
        real_estate_carousel_img_ids,
        real_estate_carousel_img_srcs,
        real_estate_carousel_img_alts,
    );
    Real_Estate_Site.add_tool_icons(
        real_estate_tool_img_ids,
        real_estate_tool_img_srcs,
        real_estate_tool_img_alts,
    );

    // Retrieve last project stored in session and execute change project if current project is not empty
    current_project = JSON.parse(sessionStorage.getItem('current_project'));
    if (current_project) {
        change_project();
        UI.dev_project_overview.innerHTML = new_inner_html;
        reinitialize_el();
    }
    UI.dev_project_gallery_btns.forEach((btn) => {
        btn.addEventListener('click', () => {
            if (btn.dataset.devProject === 'Alien Mathvasion Game') {
                current_project = Alien_Mathvasion;
            } else if (btn.dataset.devProject === 'Wix Site Clone') {
                current_project = Wix_Clone;
            } else if (btn.dataset.devProject === 'Cyberdise Online Store') {
                current_project = Cyberdise;
            } else if (btn.dataset.devProject === 'Movie Database') {
                current_project = Movie_Database;
            } else if (btn.dataset.devProject === 'Amazon Clone') {
                current_project = Amazon_Clone;
            } else if (btn.dataset.devProject === 'Real Estate Site') {
                current_project = Real_Estate_Site;
            } else {
                return logger('PROJECT NOT LOADED CORRECTLY');
            }

            // Adds new project to carousel container
            change_project();

            // Store current project in session storage
            sessionStorage.setItem(
                'current_project',
                JSON.stringify(current_project),
            );
            UI.dev_project_overview.innerHTML = new_inner_html;
            reinitialize_el();
            UI.dev_project_overview.scrollIntoView({
                behavior: 'smooth',
            });
            UI.return_to_dev_gallery_btns.forEach((btn) => {
                btn.addEventListener('click', () => {
                    UI.dev_project_gallery.scrollIntoView({
                        behavior: 'smooth',
                    });
                });
            });
        });
    });
    UI.return_to_dev_gallery_btns.forEach((btn) => {
        btn.addEventListener('click', () => {
            UI.dev_project_gallery.scrollIntoView({
                behavior: 'smooth',
            });
        });
    });

    // Executes function and provides closure for development projects
    (function () {
        // Select the node that will be observed for mutations
        const target_node = UI.dev_project_overview;

        // Options for the observer (which mutations to observe)
        const config = {
            attributes: false,
            childList: true,
            subtree: true,
        };

        // Callback function to execute when mutations are observed
        const callback = function (mutationsList, observer) {
            // Use traditional 'for loops' for IE 11
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    ///log console.log('A child node has been added or removed.');
                } else if (mutation.type === 'attributes') {
                    ///log console.log('The ' + mutation.attributeName + ' attribute was modified.');
                } else if (mutation.type === 'subtree') {
                    ///log console.log('The subtree attribute was modified.');
                }
                ///log console.log(mutation, "and ", observer);
            }
        };

        // Create an observer instance linked to the callback function
        //const observer = new MutationObserver(callback);

        // Start observing the target node for configured mutations
        //observer.observe(target_node, config);

        // Later, you can stop observing
        // observer.disconnect();
    })();
};
