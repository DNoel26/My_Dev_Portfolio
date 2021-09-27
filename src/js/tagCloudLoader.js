/** @format */

export const tagCloudLoader = (
    UI,
    media_queries,
    generate_dark_color_hex,
    debounce,
) => {
    let tagcloud_radius;
    const mq_limits = [
        window.matchMedia('(max-width: 320.98px)'),
        window.matchMedia('(min-width: 321px) and (max-width: 575.98px)'),
        window.matchMedia('(min-width: 576px) and (max-width: 767.98px)'),
        window.matchMedia('(min-width: 768px) and (max-width: 991.98px)'),
        window.matchMedia('(min-width: 992px)'),
    ];
    const tagcloud_resizer = function () {
        media_queries(
            mq_limits[0],
            () => {
                return (tagcloud_radius = 140);
            },
            null,
        );
        media_queries(
            mq_limits[1],
            () => {
                return (tagcloud_radius = 150);
            },
            null,
        );
        media_queries(
            mq_limits[2],
            () => {
                return (tagcloud_radius = 250);
            },
            null,
        );
        media_queries(
            mq_limits[3],
            () => {
                return (tagcloud_radius = 300);
            },
            null,
        );
        media_queries(
            mq_limits[4],
            () => {
                return (tagcloud_radius = undefined);
            },
            null,
        );
    };

    tagcloud_resizer();
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

        // Add more tags to existing tag cloud
        // myTags = myTags.concat([]);
        // tagCloud.update(myTags);
        UI.tagcloud_content = document.querySelector('.tag-cloud-content');
        UI.tagcloud = document.querySelector('.tagcloud');
        UI.tagcloud_items = document.querySelectorAll('.tagcloud--item');

        // Randomizes tag word colours and adds effects on click
        UI.tagcloud_items.forEach((item) => {
            item.style.color = generate_dark_color_hex();
            let clicked_once = false;
            let clicked_twice = false;
            item.addEventListener('click', () => {
                if (clicked_once && clicked_twice) {
                    item.style.fontSize = '0';
                    setTimeout(() => {
                        item.style.color = generate_dark_color_hex();
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
                                tagcloud_resizer();
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
    tagcloud_observer.observe(UI.tagcloud_content);
};
