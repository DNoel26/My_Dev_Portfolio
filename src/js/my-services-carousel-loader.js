/** @format */

import {
    debounce,
    mediaQueries,
    throttle,
} from './Business_Logic/custom-functions.js';
import UI from './UI_Logic/UI.js';

export const myServicesCarouselLoader = () => {
    let scrollAmt = 360;
    const mqLimits = [
        window.matchMedia('(max-width: 320.98px)'),
        window.matchMedia('(min-width: 321px) and (max-width: 575.98px)'),
        window.matchMedia('(min-width: 576px) and (max-width: 767.98px)'),
        window.matchMedia('(min-width: 768px) and (max-width: 991.98px)'),
        window.matchMedia('(min-width: 992px) and (max-width: 1199.98px)'),
        window.matchMedia('(min-width: 1200px) and (max-width: 1399.98px)'),
        window.matchMedia('(min-width: 1400px)'),
    ];
    const scrollAmtModifier = function () {
        mediaQueries(
            mqLimits[0],
            () => {
                return (scrollAmt = 274);
            },
            null,
        );
        mediaQueries(
            mqLimits[1],
            () => {
                return (scrollAmt = 296);
            },
            null,
        );
        mediaQueries(
            mqLimits[2],
            () => {
                return (scrollAmt = 360);
            },
            null,
        );
        mediaQueries(
            mqLimits[3],
            () => {
                return (scrollAmt = 656 / 2);
            },
            null,
        );
        mediaQueries(
            mqLimits[4],
            () => {
                return (scrollAmt = 720 / 2);
            },
            null,
        );
        mediaQueries(
            mqLimits[5],
            () => {
                return (scrollAmt = 980 / 3);
            },
            null,
        );
        mediaQueries(
            mqLimits[6],
            () => {
                return (scrollAmt = 1080 / 3);
            },
            null,
        );
    };
    scrollAmtModifier();
    window.addEventListener(
        'resize',
        debounce(() => {
            scrollAmtModifier();
            UI.myCarouselContent.scrollLeft = 0;
        }, 500),
    );
    UI.myCarouselPrevBtn.addEventListener(
        'click',
        throttle(function () {
            UI.growBtnOnClick(UI.myCarouselPrevBtn, 1.25, 250);
            UI.scrollHorizontally(UI.myCarouselContent, -scrollAmt);
            UI.scrollEnd(UI.myCarouselContent, 20);
        }, 700),
    );
    UI.myCarouselNextBtn.addEventListener(
        'click',
        throttle(function () {
            UI.growBtnOnClick(UI.myCarouselNextBtn, 1.25, 250);
            UI.scrollHorizontally(UI.myCarouselContent, scrollAmt);
            UI.scrollStart(UI.myCarouselContent, 20);
        }, 700),
    );
};
