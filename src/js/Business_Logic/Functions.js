/** @format */

'use strict';

export function logger(...data) {
    data.forEach((datum, index) => {
        return console.trace(`Logged Values[${index}]: `, datum);
    });
}
export function wrapperNoExec(func, ...args) {
    return function () {
        return func(...args);
    };
}
export function wrapperExec(func, ...args) {
    return func(...args);
}
export function debounce(func, timer) {
    let inDebounce;
    return function () {
        const context = this;
        const args = arguments;
        clearTimeout(inDebounce);
        inDebounce = setTimeout(() => {
            return func.apply(context, args);
        }, timer);
    };
}
export function throttle(func, timer) {
    let inThrottle;
    let initial = 0;
    return function () {
        const context = this;
        const args = arguments;
        if (inThrottle !== undefined) {
            return;
        } else {
            return new Promise((resolve, reject) => {
                inThrottle = setTimeout(() => {
                    inThrottle = undefined;
                    resolve(initial);
                    return func(context, args);
                }, initial ?? timer);
            })
                .then(() => {
                    if (initial === 0) {
                        initial = undefined;
                    }

                    setTimeout(() => {
                        return (initial = 0);
                    }, timer);
                })
                .catch((err) => console.error(err));
        }
    };
}
export function formSubmitSuccess(form, button, status, msg) {
    form.reset();
    button.setAttribute('disabled', 'disabled');
    status.innerHTML = msg ?? 'Submission Successful!';
}
export function formSubmitError(status, msg) {
    status.innerHTML = msg ?? 'Submission Failed!';
}
export function ajax(method, url, data, success, error, callback) {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.onreadystatechange = function () {
        if (xhr.readyState !== XMLHttpRequest.DONE) return;
        if (xhr.status === 200) {
            success();
            callback(xhr.status);
        } else {
            error();
            callback(xhr.status);
        }
    };
    return xhr.send(data);
}

// Include for screen size changes
export function mediaQueries(mq, funcTrue, funcFalse) {
    if (mq.matches) {
        // If media query matches
        return funcTrue();
    } else {
        return funcFalse ? funcFalse() : null;
    }
}
export function scrollProgress(indicator) {
    const winScroll = document.documentElement.scrollTop;
    const height =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    return (indicator.style.width = scrolled + '%');
}
export function calculateAge() {
    const diffMs = Date.now() - new Date('26 March 1990');
    const ageDt = new Date(diffMs);
    return Math.abs(ageDt.getUTCFullYear() - 1970);
}
export function generateDarkColorHex() {
    let color = '#';
    for (let i = 0; i < 3; i++) {
        color += (
            '0' + Math.floor((Math.random() * Math.pow(16, 2)) / 2).toString(16)
        ).slice(-2);
    }
    return color;
}
