/** @format */

import {
    ajax,
    debounce,
    formSubmitError,
    formSubmitSuccess,
    wrapperNoExec,
} from './Business_Logic/Functions.js';
import UI from './UI_Logic/UI.js';

export const contactFormLoader = (recaptchaCallback) => {
    // Observes if form is in view and then makes country API request if true
    const options = {
        root: null,
        rootMargin: '500px',
        threshold: 0,
    };
    let selectChange;
    const formApiObserver = new IntersectionObserver(function (
        entries,
        observer,
    ) {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                import('./Business_Logic/API.js')
                    .then((module) => module.default) // uses the default export
                    .then((Api) => {
                        // Populates form countries using API
                        const CountryApi = new Api(
                            'https://restcountries.com/v2/all',
                        );
                        let userTyped = false;
                        selectChange = function () {
                            const selectedOptions =
                                document.querySelectorAll('option');

                            // Adds country flag and phone calling code on country select
                            selectedOptions.forEach((option) => {
                                if (
                                    option.value &&
                                    option.selected &&
                                    option.value !== ''
                                ) {
                                    const flag =
                                        option.getAttribute('data-flag');
                                    const callingCodes =
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
                                    if (!userTyped)
                                        UI.phone.value = `+${callingCodes}-`;
                                    if (
                                        UI.countrySelect.labels[0]
                                            .children[1] &&
                                        UI.countrySelect.labels[0].children[1]
                                            .tagName === 'IMG'
                                    )
                                        UI.countrySelect.labels[0].children[1].remove();
                                    UI.countrySelect.labels[0].appendChild(
                                        img,
                                    );
                                } else if (option.selected && !option.value) {
                                    if (
                                        UI.countrySelect.labels[0]
                                            .children[1] &&
                                        UI.countrySelect.labels[0].children[1]
                                            .tagName === 'IMG'
                                    )
                                        UI.countrySelect.labels[0].children[1].remove();
                                }
                            });
                        };
                        CountryApi.fetchApi()
                            .then((data) => {
                                // Populates with API data
                                data.forEach((datum) => {
                                    const newOption =
                                        document.createElement('option');
                                    newOption.setAttribute(
                                        'value',
                                        datum.name,
                                    );
                                    newOption.setAttribute(
                                        'data-flag',
                                        datum.flags[0],
                                    );
                                    newOption.setAttribute(
                                        'data-calling-codes',
                                        datum.callingCodes,
                                    );
                                    newOption.innerHTML = newOption.value;
                                    UI.countrySelect.appendChild(newOption);
                                });
                                UI.phone.addEventListener(
                                    'keyup',
                                    debounce(() => {
                                        userTyped = true;
                                    }, 500),
                                );
                                UI.countrySelect.addEventListener(
                                    'change',
                                    debounce(() => {
                                        selectChange();
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
    formApiObserver.observe(UI.myForm);
    const formspree = function () {
        // Contact form validation responses on fail (for each form)
        const validationMsgs = [
            function () {
                return UI.displayFormValidationMsg();
            },
        ];

        // Fetch all the forms we want to apply custom Bootstrap validation styles to using document.querySelectorAll('.needs-validation')
        // Loop over them and prevent submission
        Array.prototype.slice
            .call(UI.formsNeedValidation)
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
                        selectChange();

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
                    UI.textArea.value = UI.textArea.value.trimStart();
                    if (UI.textArea.value.includes('    ')) {
                        UI.textArea.value = UI.textArea.value.trim();
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
                                            validationMsgs[index]();
                                        })
                                        .catch((err) => {
                                            console.error(
                                                `Failed to add "was-validated" class to Bootstrap form: ${err}`,
                                            );
                                        });
                                } else {
                                    const myForm = new Formspree(UI.myForm);
                                    myForm.method = UI.myForm.method;
                                    myForm.url = UI.myForm.action;
                                    myForm.data = new FormData(myForm.form);
                                    myForm.successMsg =
                                        `Hi ${myForm.getFormData(
                                            'first_name',
                                        ).trim()}! ` + myForm.successMsg;
                                    myForm.errorMsg =
                                        `Sorry ${myForm.getFormData(
                                            'first_name',
                                        ).trim()}! ` + myForm.errorMsg;
                                    const success = wrapperNoExec(
                                        formSubmitSuccess,
                                        myForm.form,
                                        UI.myFormBtn,
                                        UI.myFormStatus,
                                        myForm.successMsg,
                                    );
                                    const error = wrapperNoExec(
                                        formSubmitError,
                                        UI.myFormStatus,
                                        myForm.errorMsg,
                                    );
                                    ajax(
                                        myForm.method,
                                        myForm.url,
                                        myForm.data,
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
                                                        UI.countrySelect
                                                            .labels[0]
                                                            .children[1] &&
                                                        UI.countrySelect
                                                            .labels[0]
                                                            .children[1]
                                                            .tagName === 'IMG'
                                                    )
                                                        UI.countrySelect.labels[0].children[1].remove();
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
