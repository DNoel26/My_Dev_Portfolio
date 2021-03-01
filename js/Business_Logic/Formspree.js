class Formspree {

    form;
    method;
    url;
    data;
    success_msg = "Thanks for your message! I'll review and respond as soon as possible.";
    error_msg = 'Oops, sorry! There was a problem with the form submission. Ensure to check "I\'m not a robot" and try again or use an alternative method to contact me.';

    constructor(f) {

        this.form = f;
    };
};

export default Formspree;
