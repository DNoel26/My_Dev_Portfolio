/** @format */

class ToolsTech {
    name;
    icon = {
        id: null,
        src,
        alt,
    };
    skillRating;

    constructor(name, icon_src, skill_rating) {
        this.name = name;
        this.icon.src = icon_src;
        this.skillRating = skill_rating;
    }
}

export default ToolsTech;
