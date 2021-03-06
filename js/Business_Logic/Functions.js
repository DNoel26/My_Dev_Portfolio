'use strict';

export function logger(...data) {
    
    data.forEach((datum, index) => {

        return console.log(`Logged Values[${index}]: `, datum);
    });
};

export function wrapper_no_exec(func, ...args) {

    return (function () {

        return func(...args);
    });
};

export function wrapper_exec(func, ...args) {

    return func(...args);
};

export function debounce(func, timer) {

    let in_debounce;

    return function() {

        const context = this;
        const args = arguments;
        // console.log(this, arguments, func);

        clearTimeout(in_debounce);
        in_debounce = setTimeout(() => {

            return func.apply(context, args)
        }, (timer));
    };
};

export function throttle(func, timer) {

    let in_throttle;
    let initial = 0;

    return function() {

        const context = this;
        const args = arguments;
        //logger(in_throttle, initial)

        if(in_throttle !== undefined) {
            
            return;
        } else {

            return new Promise((resolve, reject) => {

                in_throttle = setTimeout(() => {

                    // console.log(in_throttle, args);
                    in_throttle = undefined;
                    
                    resolve(initial);
                    return func(context, args);
                }, (initial ?? timer));
            })
            .then(() => {

                if(initial === 0) {

                    initial = undefined;
                };

                setTimeout(() => {
                
                    return initial = 0;
                }, (timer));
            })
            .catch(err => console.log(err));
        };
    };
};

export function form_submit_success(form, button, status, msg) {

    form.reset();
    button.setAttribute("disabled", "disabled");
    status.innerHTML = msg ?? "Submission Successful!"; 
};

export function form_submit_error(status, msg) {

    status.innerHTML = msg ?? "Submission Failed!";
};

export function ajax(method, url, data, success, error) {

    const xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.setRequestHeader("Accept", "application/json");
    xhr.onreadystatechange = function() {
        if (xhr.readyState !== XMLHttpRequest.DONE) return;
        if (xhr.status === 200) {

            success();
            logger(xhr.response, xhr.responseType);
        } else {
            
            error();
            logger(xhr.status, xhr.response, xhr.responseType);
        }
    };

    xhr.send(data);
}

// Watch for screen size changes 
export function media_queries(mq, func) {

    if (mq.matches) { // If media query matches

        return func();
    } else {

        return;
    };
};

/* const mq = window.matchMedia("(max-width: 540px)");
            on_resize(mq);  Call listener function at run time

            window.addEventListener("resize", ()=>{

                console.log("media query", window.matchMedia("(min-width: 0)"))
            }); */

export function scroll_progress(indicator) {

    const win_scroll = document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (win_scroll / height) * 100;
    // console.log("SCROLLED", indicator);
    
    return indicator.style.width = scrolled + "%";
};

export function calculate_age() { 

    const diff_ms = Date.now() - new Date("26 March 1990");
    const age_dt = new Date(diff_ms); 
  
    return Math.abs(age_dt.getUTCFullYear() - 1970);
};

export function generate_dark_color_hex() {

    let color = "#";
    for (let i = 0; i < 3; i++) {

        color += ("0" + Math.floor(Math.random() * Math.pow(16, 2) / 2).toString(16)).slice(-2);
    }
    return color;
};