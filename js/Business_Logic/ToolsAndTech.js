class Tools_Tech {

    name;
    icon = {

        id: null,
        src,
        alt,
    }
    skill_rating;

    constructor(name, icon_src, skill_rating) {

        this.name = name;
        this.icon.src = icon_src;
        this.skill_rating = skill_rating;
    };
};

export default Tools_Tech;