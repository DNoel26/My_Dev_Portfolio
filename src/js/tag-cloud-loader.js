/** @format */

import {
    debounce,
    generateDarkColorHex,
    mediaQueries,
} from './Business_Logic/functions.js';
import UI from './UI_Logic/UI.js';

export const tagCloudLoader = () => {
    let tagcloudRadius;
    const mqLimits = [
        window.matchMedia('(max-width: 320.98px)'),
        window.matchMedia('(min-width: 321px) and (max-width: 575.98px)'),
        window.matchMedia('(min-width: 576px) and (max-width: 767.98px)'),
        window.matchMedia('(min-width: 768px) and (max-width: 991.98px)'),
        window.matchMedia('(min-width: 992px)'),
    ];
    const tagcloudResizer = function () {
        mediaQueries(
            mqLimits[0],
            () => {
                return (tagcloudRadius = 140);
            },
            null,
        );
        mediaQueries(
            mqLimits[1],
            () => {
                return (tagcloudRadius = 150);
            },
            null,
        );
        mediaQueries(
            mqLimits[2],
            () => {
                return (tagcloudRadius = 250);
            },
            null,
        );
        mediaQueries(
            mqLimits[3],
            () => {
                return (tagcloudRadius = 300);
            },
            null,
        );
        mediaQueries(
            mqLimits[4],
            () => {
                return (tagcloudRadius = undefined);
            },
            null,
        );
    };

    tagcloudResizer();
    let tagCloud;
    const loadTagCloudOnObserve = function (TagClouds) {
        // Define tags in js array
        let myTags = [
            'OOP',
            'SOC / MVC',
            'REST-APIs',
            'Data-Structures',
            'CI / CD',
            'UI / UX',
            'Automated-Testing',
            'Version-Control',
            'Debugging',
            'Algorithms',
            'App-Development',
            'Responsive-Design',
            'Security',
            'Optimization',
            'Customer-Service',
        ];

        // Render a default tag cloud
        // let tagCloud = TagCloud('.tag-cloud-content', myTags);
        // Config tag cloud by overriding default parameters below
        tagCloud = TagClouds('.tag-cloud-content', myTags, {
            // radius in px
            radius: tagcloudRadius ?? 340,

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
        UI.tagcloudContent = document.querySelector('.tag-cloud-content');
        UI.tagcloud = document.querySelector('.tagcloud');
        UI.tagcloudItems = document.querySelectorAll('.tagcloud--item');

        // Randomizes tag word colours and adds effects on click
        UI.tagcloudItems.forEach((item) => {
            item.style.color = generateDarkColorHex();
            let clicked_once = false;
            let clicked_twice = false;
            item.addEventListener('click', () => {
                if (clicked_once && clicked_twice) {
                    item.style.fontSize = '0';
                    setTimeout(() => {
                        item.style.color = generateDarkColorHex();
                        item.style.fontSize = 'initial';
                        item.style.fontWeight = '400';
                        clicked_once = false;
                        clicked_twice = false;
                    }, 5000);
                } else if (clicked_once && !clicked_twice) {
                    item.style.color = 'var(--theme-colour-4)';
                    item.style.fontSize = '140%';
                    clicked_twice = true;
                } else {
                    item.style.color = 'var(--theme-colour-1)';
                    item.style.fontSize = '120%';
                    clicked_once = true;
                }
            });
        });
    };

    // Delay loading of tag cloud until almost within view
    const options = {
        root: null,
        rootMargin: '1000px',
        threshold: 0,
    };
    const tagcloud_observer = new IntersectionObserver(function (
        entries,
        observer,
    ) {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                import('./Business_Logic/TagCloud.js')
                    .then((module) => module.default)
                    .then((TagCloud) => {
                        loadTagCloudOnObserve(TagCloud);

                        // Resets and resizes tag cloud for different screen sizes
                        window.addEventListener(
                            'resize',
                            debounce(function () {
                                tagcloudResizer();
                                if (UI.tagcloud) UI.tagcloud.remove();
                                loadTagCloudOnObserve(TagCloud);
                            }, 500),
                        );
                    })
                    .catch((err) =>
                        console.error(
                            'Failed to import TagCloud module: ',
                            err,
                        ),
                    );
            }
        });
    },
    options);
    tagcloud_observer.observe(UI.tagcloudContent);
};
