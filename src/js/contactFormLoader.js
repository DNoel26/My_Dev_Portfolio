/** @format */

import {
    ajax,
    form_submit_error,
    form_submit_success,
    wrapper_no_exec,
} from './Business_Logic/Functions.js';

export const contactFormLoader = (UI, debounce, recaptchaCallback) => {
    // Observes if form is in view and then makes country API request if true
    const options = {
        root: null,
        rootMargin: '500px',
        threshold: 0,
    };
    let select_change;
    const form_api_observer = new IntersectionObserver(function (
        entries,
        observer,
    ) {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                import('./Business_Logic/API.js')
                    .then((module) => module.default) // uses the default export
                    .then((API) => {
                        // Populates form countries using API
                        const Country_API = new API(
                            'https://restcountries.com/v2/all',
                        );
                        let user_typed = false;
                        select_change = function () {
                            const selected_options =
                                document.querySelectorAll('option');

                            // Adds country flag and phone calling code on country select
                            selected_options.forEach((option) => {
                                if (
                                    option.value &&
                                    option.selected &&
                                    option.value !== ''
                                ) {
                                    const flag =
                                        option.getAttribute('data-flag');
                                    const calling_codes =
                                        option.getAttribute(
                                            'data-calling-codes',
                                        );
                                    const img = document.createElement('img');
                                    img.setAttribute('src', flag);
                                    img.setAttribute(
                                        'alt',
                                        `Country flag for ${option.value}`,
                                    );
                                    img.setAttribute('width', '40px');
                                    img.setAttribute('height', 'auto');
                                    img.style.marginLeft = '10px';
                                    if (!user_typed)
                                        UI.phone.value = `+${calling_codes}-`;
                                    if (
                                        UI.country_select.labels[0]
                                            .children[1] &&
                                        UI.country_select.labels[0].children[1]
                                            .tagName === 'IMG'
                                    )
                                        UI.country_select.labels[0].children[1].remove();
                                    UI.country_select.labels[0].appendChild(
                                        img,
                                    );
                                } else if (option.selected && !option.value) {
                                    if (
                                        UI.country_select.labels[0]
                                            .children[1] &&
                                        UI.country_select.labels[0].children[1]
                                            .tagName === 'IMG'
                                    )
                                        UI.country_select.labels[0].children[1].remove();
                                }
                            });
                        };
                        Country_API.fetch_api()
                            .then((data) => {
                                // Populates with API data
                                data.forEach((datum) => {
                                    const new_option =
                                        document.createElement('option');
                                    new_option.setAttribute(
                                        'value',
                                        datum.name,
                                    );
                                    new_option.setAttribute(
                                        'data-flag',
                                        datum.flag,
                                    );
                                    new_option.setAttribute(
                                        'data-calling-codes',
                                        datum.callingCodes,
                                    );
                                    new_option.innerHTML = new_option.value;
                                    UI.country_select.appendChild(new_option);
                                });
                                UI.phone.addEventListener(
                                    'keyup',
                                    debounce(() => {
                                        user_typed = true;
                                    }, 500),
                                );
                                UI.country_select.addEventListener(
                                    'change',
                                    debounce(() => {
                                        select_change();
                                    }, 300),
                                );
                            })
                            .catch((err) => console.error('Error: ', err))
                            .then(() => formspree()); // Executes formspree function regardless of promise fulfillment or rejection
                    })
                    .catch((err) =>
                        console.log('Failed to import API module: ', err),
                    );
            }
        });
    },
    options);
    form_api_observer.observe(UI.my_form);
    const formspree = function () {
        // Contact form validation responses on fail (for each form)
        const validation_msgs = [
            function () {
                return UI.display_form_validation_msg();
            },
        ];

        // Fetch all the forms we want to apply custom Bootstrap validation styles to using document.querySelectorAll('.needs-validation')
        // Loop over them and prevent submission
        Array.prototype.slice
            .call(UI.forms_need_validation)
            .forEach(function (form, index) {
                (function () {
                    // Cycle through each form input/select/text area tags and store or populate with sessionStorage
                    form.querySelectorAll('.form-data').forEach((data) => {
                        if (data.tagName === 'INPUT')
                            data.value = sessionStorage.getItem(data.name);
                        if (data.tagName === 'TEXTAREA')
                            data.value = sessionStorage.getItem(data.name);
                        if (data.tagName === 'SELECT')
                            data.value =
                                sessionStorage.getItem(data.name) || '';
                        select_change();

                        // Save contact form info in cookies
                        data.addEventListener(
                            'input',
                            debounce(() => {
                                sessionStorage.setItem(data.name, data.value);
                            }, 500),
                        );
                    });
                })();

                form.addEventListener('input', () => {
                    UI.text_area.value = UI.text_area.value.trimStart();
                    if (UI.text_area.value.includes('    ')) {
                        UI.text_area.value = UI.text_area.value.trim();
                    }
                });

                // Heavily modified Bootstrap validation and Formspree functions (Ajax method - prevents redirection on form submit)
                form.addEventListener(
                    'submit',
                    (event) => {
                        event.preventDefault();
                        //UI.text_area.value = UI.text_area.value.trim();

                        // Stop multiple submits from occurring
                        event.stopImmediatePropagation();
                        import('./Business_Logic/Formspree.js')
                            .then((module) => module.default) // uses the default export
                            .then((Formspree) => {
                                if (!form.checkValidity()) {
                                    return new Promise((resolve, reject) => {
                                        // Checks validation on submit
                                        form.classList.add('was-validated');
                                        resolve();
                                    })
                                        .then(() => {
                                            // Displays validation messages if failed to enter info correctly
                                            validation_msgs[index]();
                                        })
                                        .catch((err) => {
                                            console.error(
                                                `Failed to add "was-validated" class to Bootstrap form: ${err}`,
                                            );
                                        });
                                } else {
                                    const My_Form = new Formspree(UI.my_form);
                                    My_Form.method = UI.my_form.method;
                                    My_Form.url = UI.my_form.action;
                                    My_Form.data = new FormData(My_Form.form);
                                    My_Form.success_msg =
                                        `Hi ${My_Form.get_form_data(
                                            'first_name',
                                        ).trim()}! ` + My_Form.success_msg;
                                    My_Form.error_msg =
                                        `Sorry ${My_Form.get_form_data(
                                            'first_name',
                                        ).trim()}! ` + My_Form.error_msg;
                                    const success = wrapper_no_exec(
                                        form_submit_success,
                                        My_Form.form,
                                        UI.my_form_button,
                                        UI.my_form_status,
                                        My_Form.success_msg,
                                    );
                                    const error = wrapper_no_exec(
                                        form_submit_error,
                                        UI.my_form_status,
                                        My_Form.error_msg,
                                    );
                                    ajax(
                                        My_Form.method,
                                        My_Form.url,
                                        My_Form.data,
                                        success,
                                        error,
                                        (status) => {
                                            // Callback executed onreadystatechange
                                            if (status === 200) {
                                                recaptchaCallback(() => {
                                                    form.classList.remove(
                                                        'was-validated',
                                                    );
                                                    sessionStorage.clear();
                                                    if (
                                                        UI.country_select
                                                            .labels[0]
                                                            .children[1] &&
                                                        UI.country_select
                                                            .labels[0]
                                                            .children[1]
                                                            .tagName === 'IMG'
                                                    )
                                                        UI.country_select.labels[0].children[1].remove();
                                                });
                                            } else return;
                                            return;
                                        },
                                    );
                                }
                            })
                            .catch((err) =>
                                console.error(
                                    'Failed to import Formspree module: ',
                                    err,
                                ),
                            );
                    },
                    false,
                );
            });
    };
};
