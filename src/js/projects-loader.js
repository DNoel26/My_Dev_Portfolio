/** @format */

import { logger } from './Business_Logic/custom-functions.js';
import Project from './Business_Logic/Project.js';
import UI from './UI_Logic/UI.js';

export const projectsLoader = () => {
    /**@type {Project} */
    let currentDevProject = {};
    let newDevInnerHtml = ``;

    /**@type {Project} */
    let currentClientProject = {};
    let newClientInnerHtml = ``;
    const devProjectCarousel = new bootstrap.Carousel(UI.devProjectCarousel, {
        interval: 5000,
    });
    const clientProjectCarousel = new bootstrap.Carousel(
        UI.clientProjectCarousel,
        {
            interval: 5000,
        },
    );

    // Adds an indicator button, along with attributes per image and sets active class to first slide
    // Accepts a single parameter with values "dev" or "client"
    const populateCarouselIndicators = function (projType, currentProject) {
        currentProject.carouselImgList.srcs.forEach((indicator, index) => {
            const btn = document.createElement('button');
            btn.setAttribute('type', 'button');
            if (projType.toLowerCase() === 'dev') {
                btn.setAttribute('data-bs-target', '#dev-project-carousel');
            } else if (projType.toLowerCase() === 'client') {
                btn.setAttribute('data-bs-target', '#client-project-carousel');
            }
            if (index === 0)
                btn.classList.add('active', 'btn'),
                    btn.setAttribute('aria-current', 'true');
            else btn.classList.add('btn');
            btn.setAttribute('aria-label', `Slide ${index + 1}`);

            // Append to dev or client project depending on parameter set
            if (projType.toLowerCase() === 'dev') {
                UI.devProjectCarouselIndicatorSection.appendChild(btn);
            } else if (projType.toLowerCase() === 'client') {
                UI.clientProjectCarouselIndicatorSection.appendChild(btn);
            }
        });
    };

    // Adds each image along with attributes, to the carousel slideshow
    // Accepts a single parameter with values "dev" or "client"
    const populateCarouselImgData = function (projType, currentProject) {
        currentProject.carouselImgList.srcs.forEach((src, index) => {
            const div = document.createElement('div');
            if (index === 0) div.classList.add('carousel-item', 'active');
            else div.classList.add('carousel-item');
            const img = document.createElement('img');
            img.setAttribute('loading', 'lazy');
            img.classList.add('d-block', 'w-100', 'p-3');
            img.setAttribute('src', src);
            img.setAttribute(
                'alt',
                currentProject.carouselImgList.alts[index] ||
                    'My project carousel image',
            );
            img.setAttribute('width', '625');
            img.setAttribute('height', '500');
            div.appendChild(img);

            // Append to dev or client project depending on parameter set
            if (projType.toLowerCase() === 'dev') {
                UI.devProjectCarouselInnerSection.appendChild(div);
            } else if (projType.toLowerCase() === 'client') {
                UI.clientProjectCarouselInnerSection.appendChild(div);
            }
        });
    };

    // Adds notes to project overview
    // Accepts a single parameter with values "dev" or "client"
    const populateProjectNotes = function (projType, currentProject) {
        currentProject.notes.forEach((note, index) => {
            const list = document.createElement('li');
            list.innerHTML = note;
            if (index === currentProject.notes.length - 1)
                list.classList.add('fw-bold');

            // Append to dev or client project depending on parameter set
            if (projType.toLowerCase() === 'dev') {
                UI.devProjectCarouselNoteSection.appendChild(list);
            } else if (projType.toLowerCase() === 'client') {
                UI.clientProjectCarouselNoteSection.appendChild(list);
            }
        });
    };

    // Adds each tool / technology icon to the end of the project overview
    // Accepts a single parameter with values "dev" or "client"
    const populateProjectToolIcons = function (projType, currentProject) {
        currentProject.toolIconList.srcs.forEach((src, index) => {
            const img = document.createElement('img');
            img.setAttribute('loading', 'lazy');
            img.classList.add('img-fluid', 'icon-disp-img-lg', 'm-3');
            img.id = currentProject.toolIconList.ids[index] || null;
            img.setAttribute('src', src);
            img.setAttribute(
                'alt',
                currentProject.toolIconList.alts[index] ||
                    'Tool and Technology Icon Badge',
            );
            img.setAttribute('width', '85');
            img.setAttribute('height', '64');

            // Append to dev or client project depending on parameter set
            if (projType.toLowerCase() === 'dev') {
                UI.devProjectCarouselIconSection.appendChild(img);
            } else if (projType.toLowerCase() === 'client') {
                UI.clientProjectCarouselIconSection.appendChild(img);
            }
        });
    };
    const changeDevProject = function () {
        newDevInnerHtml = `
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
                                <h3 class="text-center">${currentDevProject.name}</h3>
                                
                                <p>
                                    ${currentDevProject.description}
                                    <br><strong>Status: ${currentDevProject.status.msg} <span class="${currentDevProject.status.classCode} status-circle"></span></strong>
                                </p>
                                
                                <a href=${currentDevProject.link} class="fs-5 text-reset text-decoration-none anim-link-2 w-auto" target="_blank" rel="noopener"><strong class="text-custom-2"><i class="fas fa-external-link-alt"></i> Click</strong> to ${currentDevProject.linkHeader} Now ${currentDevProject.linkNote}</a>
                                <br><a href=${currentDevProject.githubLink} class="fs-5 text-reset text-decoration-none anim-link-2 w-auto" target="_blank" rel="noopener"><strong class="text-custom-1"><i class="fas fa-external-link-alt"></i> Click</strong> to Review Code ${currentDevProject.githubReadme}</a>

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
    const changeClientProject = function () {
        newClientInnerHtml = `
                    <div class="flex-row row justify-content-between align-items-center">
                        <div class="col-12 col-xl-6">
                            <div id="client-project-carousel" class="carousel slide" data-bs-ride="carousel">
                                <div class="carousel-indicators" id="client-project-carousel-indicators">
                                    
                                </div>

                                <div class="carousel-inner" id="client-project-carousel-inner">

                                </div>

                                <button class="carousel-control-prev btn h-50 m-auto" type="button" data-bs-target="#client-project-carousel" data-bs-slide="prev">
                                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
    
                                    <span class="visually-hidden">Previous</span>
                                </button>

                                <button class="carousel-control-next btn h-50 m-auto" type="button" data-bs-target="#client-project-carousel" data-bs-slide="next">
                                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
    
                                    <span class="visually-hidden">Next</span>
                                </button>
                            </div>

                            <button class="btn btn-custom-2 my-5 d-block mx-auto w-auto btn-anim" data-id="client-project-gallery">
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
                                <h3 class="text-center">${currentClientProject.name}</h3>
                                
                                <p>
                                    ${currentClientProject.description}
                                    <br><strong>Status: ${currentClientProject.status.msg} <span class="${currentClientProject.status.classCode} status-circle"></span></strong>
                                </p>
                                
                                <a href=${currentClientProject.link} class="fs-5 text-reset text-decoration-none anim-link-2 w-auto" target="_blank" rel="noopener"><strong class="text-custom-2"><i class="fas fa-external-link-alt"></i> Click</strong> to Visit Site</a>

                                <ul class="text-wrap" id="client-project-carousel-notes">
                                    
                                </ul>  

                                <h3 class="small mt-3">- Built Using -</h3>

                                <div class="icon-row-sm mb-3" id="client-project-carousel-icon-section">
                                    
                                </div>
                            </div>  

                            <button class="btn btn-custom-2 my-5 d-block mx-auto w-auto btn-anim d-xl-none" data-id="client-project-gallery">
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
    const reinitializeEl = function (projType, currentProject) {
        // Re-declare (update) document IDs on new inner html
        if (projType.toLowerCase() === 'dev') {
            UI.returnToDevGalleryBtns = document.querySelectorAll(
                "[data-id='dev-project-gallery']",
            );
            UI.devProjectCarousel = document.getElementById(
                'dev-project-carousel',
            );
            UI.devProjectCarouselIndicatorSection = document.getElementById(
                'dev-project-carousel-indicators',
            );
            UI.devProjectCarouselInnerSection = document.getElementById(
                'dev-project-carousel-inner',
            );
            UI.devProjectCarouselNoteSection = document.getElementById(
                'dev-project-carousel-notes',
            );
            UI.devProjectCarouselIconSection = document.getElementById(
                'dev-project-carousel-icon-section',
            );
        } else if (projType.toLowerCase() === 'client') {
            UI.returnToClientGalleryBtns = document.querySelectorAll(
                "[data-id='client-project-gallery']",
            );
            UI.clientProjectCarousel = document.getElementById(
                'client-project-carousel',
            );
            UI.clientProjectCarouselIndicatorSection = document.getElementById(
                'client-project-carousel-indicators',
            );
            UI.clientProjectCarouselInnerSection = document.getElementById(
                'client-project-carousel-inner',
            );
            UI.clientProjectCarouselNoteSection = document.getElementById(
                'client-project-carousel-notes',
            );
            UI.clientProjectCarouselIconSection = document.getElementById(
                'client-project-carousel-icon-section',
            );
        }
        populateCarouselImgData(projType, currentProject);
        populateCarouselIndicators(projType, currentProject);
        populateProjectNotes(projType, currentProject);
        populateProjectToolIcons(projType, currentProject);
        dispatchEvent(new Event('load'));
    };

    // Alien Mathvasion Project
    const AlienMathvasion = new Project(
        'Alien Mathvasion Game',
        2,
        'https://dnoelmathinvasiongame.netlify.app/html/gamescreen.html',
        'Play',
        'https://github.com/DNoel26/Alien_Mathvasion',
        true,
    );
    AlienMathvasion.description = `This project was designed for children ages 8+ with the goal of making math fun and engaging. It was built from scratch without any frameworks, libraries or dependencies using OOP and SOC principles, and with the 
                intention of making code DRY and easier to maintain. Utilizes heavy JavaScript and DOM manipulation. Uses promises instead of while loops to track progress. Visual design is based on retro arcade Shoot-em Up games.
                Good luck surviving the hardest difficulty!
            `;
    AlienMathvasion.linkNote = '(expect audio - desktop version only!)';
    AlienMathvasion.notes.push(
        `Gameplay works completely but there are some minor bugs to fix, mainly in the areas of UI/UX. Very rarely, game does not load when difficulty is selected. Simply refresh the browser and try again.`,
    );
    AlienMathvasion.notes.push(
        `Some features are missing such as player entered details, data persistence, settings; to be implemented at a later date.`,
    );
    AlienMathvasion.notes.push(
        `Use Google Chrome for the best experience. Not yet fully responsive on smaller devices!`,
    );
    const alienMathCarouselImgIds = [];
    const alienMathCarouselImgSrcs = [
        './img/projects/min/alien-mathvasion-1-min.webp',
        './img/projects/min/alien-mathvasion-2-min.webp',
        './img/projects/min/alien-mathvasion-3-min.webp',
    ];
    const alienMathCarouselImgAlts = [];
    const alienMathToolImgIds = [];
    const alienMathToolImgSrcs = [
        './img/logos/html5-badge.webp',
        './img/logos/css3-badge.webp',
        './img/logos/javascript-badge.webp',
    ];
    const alienMathToolImgAlts = [];
    AlienMathvasion.addImgs(
        alienMathCarouselImgIds,
        alienMathCarouselImgSrcs,
        alienMathCarouselImgAlts,
    );
    AlienMathvasion.addToolIcons(
        alienMathToolImgIds,
        alienMathToolImgSrcs,
        alienMathToolImgAlts,
    );

    // Wix Clone Project
    const WixClone = new Project(
        'Wix Site Clone',
        1,
        'https://dnoelmotorcyclewixclone.netlify.app/',
        'View',
        'https://github.com/DNoel26/Wix_Motorcycle_Trial',
        true,
    );
    WixClone.description = `This was my first official development project and was intended to be a pixel for pixel clone of
                <a target="_blank" class="text-reset text-decoration-none anim-link-3" rel="noopener" href="https://www.wix.com/website-template/view/html/773?siteId=32647d89-1460-4326-b084-a958bf90765d&metaSiteId=129904ad-3051-8c87-f69f-31ce75166f9c&originUrl=https%3A%2F%2Fwww.wix.com%2Fwebsite%2Ftemplates%3Fcriteria%3Dauto&tpClick=view_button">a selected, original Wix site</a>. 
                It was built using HTML, CSS and without any JavaScript. 
                Showcases the ability to take a design and convert it into a functional webpage or website.
            `;
    WixClone.linkNote = '(see link to cloned Wix site above)';
    WixClone.notes.push(
        `Only 3 pages were cloned for this project: Home, About and Contact.`,
    );
    WixClone.notes.push(`Website is fully responsive for all devices!`);
    const wixCloneCarouselImgIds = [];
    const wixCloneCarouselImgSrcs = [
        './img/projects/min/wix-clone-1-min.webp',
        './img/projects/min/wix-clone-2-min.webp',
        './img/projects/min/wix-clone-3-min.webp',
    ];
    const wixCloneCarouselImgAlts = [];
    const wixCloneToolImgIds = [];
    const wixCloneToolImgSrcs = [
        './img/logos/html5-badge.webp',
        './img/logos/css3-badge.webp',
    ];
    const wixCloneToolImgAlts = [];
    WixClone.addImgs(
        wixCloneCarouselImgIds,
        wixCloneCarouselImgSrcs,
        wixCloneCarouselImgAlts,
    );
    WixClone.addToolIcons(
        wixCloneToolImgIds,
        wixCloneToolImgSrcs,
        wixCloneToolImgAlts,
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
    Cyberdise.linkNote = '(fake credentials only - desktop version only!)';
    Cyberdise.notes.push(
        `Most other major features are working as expected. Search functionality not implemented just yet.`,
    );
    Cyberdise.notes.push(`Some UI elements are incomplete/missing.`);
    Cyberdise.notes.push(`Not yet fully responsive on smaller devices!`);
    const cyberdiseCarouselImgIds = [];
    const cyberdiseCarouselImgSrcs = [
        './img/projects/min/cyberdise-online-store-1-min.webp',
        './img/projects/min/cyberdise-online-store-2-min.webp',
        './img/projects/min/cyberdise-online-store-3-min.webp',
        './img/projects/min/cyberdise-online-store-4-min.webp',
        './img/projects/min/cyberdise-online-store-5-min.webp',
    ];
    const cyberdiseCarouselImgAlts = [];
    const cyberdiseToolImgIds = [];
    const cyberdiseToolImgSrcs = [
        './img/logos/html5-badge.webp',
        './img/logos/css3-badge.webp',
        './img/logos/javascript-badge.webp',
        './img/logos/handlebars-badge.webp',
        '/img/logos/mysql-badge.webp',
        './img/logos/nodejs-badge.webp',
        './img/logos/express-logo.webp',
        './img/logos/postman-badge.webp',
    ];
    const cyberdiseToolImgAlts = [];
    Cyberdise.addImgs(
        cyberdiseCarouselImgIds,
        cyberdiseCarouselImgSrcs,
        cyberdiseCarouselImgAlts,
    );
    Cyberdise.addToolIcons(
        cyberdiseToolImgIds,
        cyberdiseToolImgSrcs,
        cyberdiseToolImgAlts,
    );

    // Movie Database Project
    const MovieDatabase = new Project(
        'Movie Database',
        2,
        'https://dnoelmovieapidatabase.netlify.app/',
        'View',
        'https://github.com/DNoel26/Movie_Database',
        true,
    );
    MovieDatabase.description = `
                This project was built from scratch to dynamically display "Now Showing" movie details and trailers via consuming multiple APIs; meaning all data shown on my website is requested
                and pulled from another server, and manipulated on my website using JavaScript. Design is based on retro theatres. Click the link and take a look at all the trending movies now!
            `;
    MovieDatabase.linkNote = '(desktop version only!)';
    MovieDatabase.notes.push(
        `All major features are working as expected. Pagination to be implemented.`,
    );
    MovieDatabase.notes.push(`Not yet fully responsive on smaller devices!`);
    const movieDbCarouselImgIds = [];
    const movieDbCarouselImgSrcs = [
        './img/projects/min/movie-db-1-min.webp',
        './img/projects/min/movie-db-2-min.webp',
        './img/projects/min/movie-db-3-min.webp',
    ];
    const movieDbCarouselImgAlts = [];
    const movieDbToolsImgIds = [];
    const movieDbToolsImgSrcs = [
        './img/logos/html5-badge.webp',
        './img/logos/css3-badge.webp',
        './img/logos/javascript-badge.webp',
    ];
    const movieDbToolsImgAlts = [];
    MovieDatabase.addImgs(
        movieDbCarouselImgIds,
        movieDbCarouselImgSrcs,
        movieDbCarouselImgAlts,
    );
    MovieDatabase.addToolIcons(
        movieDbToolsImgIds,
        movieDbToolsImgSrcs,
        movieDbToolsImgAlts,
    );

    // Amazon Clone Project
    const AmazonClone = new Project(
        'Amazon Clone',
        2,
        'https://clone-905a7.web.app/',
        'Interact',
        'https://github.com/DNoel26/Amazon_React_Clone',
        true,
    );
    AmazonClone.description = `
                This project was done as my hands on introduction to React.js and Firebase. In this particular case, I followed a tutorial and manipulated my code rather than building from scratch.
                The main purpose was to understand the concepts behind the very popular React.js framework, as well as to learn new methods for coding. Main project features are account creation, 
                login, add to cart, and payment processing using Stripe API. Please use only FAKE CREDENTIALS if creating an account to login. See my GitHub readme for further instructions. 
            `;
    AmazonClone.linkNote = '(fake credentials only - desktop version only!)';
    AmazonClone.notes.push(`All major features are working as expected.`);
    AmazonClone.notes.push(`Not yet fully responsive on smaller devices!`);
    const amazonCloneCarouselImgIds = [];
    const amazonCloneCarouselImgSrcs = [
        './img/projects/min/amazon-clone-1-min.webp',
        './img/projects/min/amazon-clone-2-min.webp',
        './img/projects/min/amazon-clone-3-min.webp',
        './img/projects/min/amazon-clone-4-min.webp',
    ];
    const amazonCloneCarouselImgAlts = [];
    const amazonCloneToolImgIds = [];
    const amazonCloneToolImgSrcs = [
        './img/logos/html5-badge.webp',
        './img/logos/css3-badge.webp',
        './img/logos/javascript-badge.webp',
        './img/logos/react-badge.webp',
        './img/logos/firebase-badge.webp',
        './img/logos/nodejs-badge.webp',
        './img/logos/express-logo.webp',
    ];
    const amazonCloneToolImgAlts = [];
    AmazonClone.addImgs(
        amazonCloneCarouselImgIds,
        amazonCloneCarouselImgSrcs,
        amazonCloneCarouselImgAlts,
    );
    AmazonClone.addToolIcons(
        amazonCloneToolImgIds,
        amazonCloneToolImgSrcs,
        amazonCloneToolImgAlts,
    );

    // Real Estate Website Project
    const RealEstateSite = new Project(
        'Real Estate Site',
        3,
        'https://presidentialrealtors-dev-static.netlify.app/',
        'View',
        'https://github.com/DNoel26/Presidential-Realtors-Static',
        true,
    );
    RealEstateSite.description = `
                The focus of this project was for me to learn and implement modern design, user interface (UI) and user experience (UX) elements. It was built from scratch and will eventually be converted
                to a fully functional single page application (SPA) using React.js, MongoDB, Node.js and Express.js. Let me know what you think!
            `;
    RealEstateSite.linkNote = '(desktop version only!)';
    RealEstateSite.notes.push(
        `Most client side features work as expected. Focus of this project was on design elements rather than functionality.`,
    );
    RealEstateSite.notes.push(
        `Project to be redone as an app (SPA) with the the functionalities expected of a real estate website.`,
    );
    RealEstateSite.notes.push(`Not yet fully responsive on smaller devices!`);
    const realEstateCarouselImgIds = [];
    const realEstateCarouselImgSrcs = [
        './img/projects/min/real-estate-1-min.webp',
        './img/projects/min/real-estate-2-min.webp',
        './img/projects/min/real-estate-3-min.webp',
    ];
    const realEstateCarouselImgAlts = [];
    const realEstateToolImgIds = [];
    const realEstateToolImgSrcs = [
        './img/logos/html5-badge.webp',
        './img/logos/css3-badge.webp',
    ];
    const realEstateToolImgAlts = [];
    RealEstateSite.addImgs(
        realEstateCarouselImgIds,
        realEstateCarouselImgSrcs,
        realEstateCarouselImgAlts,
    );
    RealEstateSite.addToolIcons(
        realEstateToolImgIds,
        realEstateToolImgSrcs,
        realEstateToolImgAlts,
    );

    // Retrieve last project stored in session and execute change project if current project is not empty
    currentDevProject = JSON.parse(
        sessionStorage.getItem('current_dev_project'),
    );
    currentClientProject = JSON.parse(
        sessionStorage.getItem('current_client_project'),
    );
    if (currentDevProject) {
        changeDevProject();
        UI.devProjectOverview.innerHTML = newDevInnerHtml;
        reinitializeEl('dev', currentDevProject);
    }
    if (currentClientProject) {
        changeClientProject();
        UI.clientProjectOverview.innerHTML = newDevInnerHtml;
        reinitializeEl('client', currentClientProject);
    }
    UI.devProjectGalleryBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
            if (btn.dataset.devProject === 'Alien Mathvasion Game') {
                currentDevProject = AlienMathvasion;
            } else if (btn.dataset.devProject === 'Wix Site Clone') {
                currentDevProject = WixClone;
            } else if (btn.dataset.devProject === 'Cyberdise Online Store') {
                currentDevProject = Cyberdise;
            } else if (btn.dataset.devProject === 'Movie Database') {
                currentDevProject = MovieDatabase;
            } else if (btn.dataset.devProject === 'Amazon Clone') {
                currentDevProject = AmazonClone;
            } else if (btn.dataset.devProject === 'Real Estate Site') {
                currentDevProject = RealEstateSite;
            } else {
                return logger('PROJECT NOT LOADED CORRECTLY');
            }

            // Adds new project to carousel container
            changeDevProject();

            // Store current project in session storage
            sessionStorage.setItem(
                'current_dev_project',
                JSON.stringify(currentDevProject),
            );
            UI.devProjectOverview.innerHTML = newDevInnerHtml;
            reinitializeEl('dev', currentDevProject);
            UI.devProjectOverview.scrollIntoView({
                behavior: 'smooth',
            });
            UI.returnToDevGalleryBtns.forEach((btn) => {
                btn.addEventListener('click', () => {
                    UI.devProjectGallery.scrollIntoView({
                        behavior: 'smooth',
                    });
                });
            });
        });
    });
    UI.returnToDevGalleryBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
            UI.devProjectGallery.scrollIntoView({
                behavior: 'smooth',
            });
        });
    });
    UI.clientProjectGalleryBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
            if (btn.dataset.clientProject === 'RCN Chemicals Limited') {
                currentClientProject;
            } else {
                return logger('PROJECT NOT LOADED CORRECTLY');
            }

            // Adds new project to carousel container
            changeDevProject();

            // Store current project in session storage
            sessionStorage.setItem(
                'current_client_project',
                JSON.stringify(currentClientProject),
            );
            UI.clientProjectOverview.innerHTML = newClientInnerHtml;
            reinitializeEl('client', currentClientProject);
            UI.clientProjectOverview.scrollIntoView({
                behavior: 'smooth',
            });
            UI.returnToClientGalleryBtns.forEach((btn) => {
                btn.addEventListener('click', () => {
                    UI.clientProjectGallery.scrollIntoView({
                        behavior: 'smooth',
                    });
                });
            });
        });
    });
    UI.returnToClientGalleryBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
            UI.clientProjectGallery.scrollIntoView({
                behavior: 'smooth',
            });
        });
    });

    // Executes function and provides closure for development projects
    (function () {
        // Select the node that will be observed for mutations
        const target_node = UI.devProjectOverview;

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
