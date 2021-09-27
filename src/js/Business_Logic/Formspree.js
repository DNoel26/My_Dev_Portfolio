/** @format */

class Formspree {
    form;
    method;
    url;
    data;
    successMsg =
        "Thanks for your message! I'll review and respond as soon as possible.";
    errorMsg =
        'It seems like there was a problem with the form submission. Ensure to check "I\'m not a robot" and try again or use an alternative method to contact me if that doesn\'t work (It really should though).';

    constructor(form) {
        this.form = form;
    }

    getFormData(key) {
        return this.data.get(key);
    }
}

export default Formspree;
