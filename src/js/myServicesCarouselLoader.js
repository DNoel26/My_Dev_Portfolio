/** @format */

export const myServicesCarouselLoader = (
    UI,
    media_queries,
    debounce,
    throttle,
) => {
    let scroll_amt = 360;
    const mq_limits = [
        window.matchMedia('(max-width: 320.98px)'),
        window.matchMedia('(min-width: 321px) and (max-width: 575.98px)'),
        window.matchMedia('(min-width: 576px) and (max-width: 767.98px)'),
        window.matchMedia('(min-width: 768px) and (max-width: 991.98px)'),
        window.matchMedia('(min-width: 992px) and (max-width: 1199.98px)'),
        window.matchMedia('(min-width: 1200px) and (max-width: 1399.98px)'),
        window.matchMedia('(min-width: 1400px)'),
    ];
    const scroll_amt_modifier = function () {
        media_queries(
            mq_limits[0],
            () => {
                return (scroll_amt = 274);
            },
            null,
        );
        media_queries(
            mq_limits[1],
            () => {
                return (scroll_amt = 296);
            },
            null,
        );
        media_queries(
            mq_limits[2],
            () => {
                return (scroll_amt = 360);
            },
            null,
        );
        media_queries(
            mq_limits[3],
            () => {
                return (scroll_amt = 656 / 2);
            },
            null,
        );
        media_queries(
            mq_limits[4],
            () => {
                return (scroll_amt = 720 / 2);
            },
            null,
        );
        media_queries(
            mq_limits[5],
            () => {
                return (scroll_amt = 980 / 3);
            },
            null,
        );
        media_queries(
            mq_limits[6],
            () => {
                return (scroll_amt = 1080 / 3);
            },
            null,
        );
    };
    scroll_amt_modifier();
    window.addEventListener(
        'resize',
        debounce(() => {
            scroll_amt_modifier();
            UI.my_carousel_content.scrollLeft = 0;
        }, 500),
    );
    UI.my_carousel_prev_btn.addEventListener(
        'click',
        throttle(function () {
            UI.grow_btn_onclick(UI.my_carousel_prev_btn, 1.25, 250);
            UI.scroll_horizontally(UI.my_carousel_content, -scroll_amt);
            UI.scroll_end(UI.my_carousel_content, 20);
        }, 700),
    );
    UI.my_carousel_next_btn.addEventListener(
        'click',
        throttle(function () {
            UI.grow_btn_onclick(UI.my_carousel_next_btn, 1.25, 250);
            UI.scroll_horizontally(UI.my_carousel_content, scroll_amt);
            UI.scroll_start(UI.my_carousel_content, 20);
        }, 700),
    );
};
